import { addDocument, updateDocument } from '@/app/db/firestoreService';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ message: 'Paystack secret key is not configured.' }, { status: 500 });
  }

  try {
    const { account_number, bank_code, amount, currency = 'NGN', currentDbUser } = await req.json();

    if (!account_number || !bank_code || !amount) {
      return NextResponse.json({ message: 'Invalid input parameters.' }, { status: 400 });
    }

    // Resolve the account details
    const resolveAccountResponse = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!resolveAccountResponse.ok) {
      const errorData = await resolveAccountResponse.json();
      return NextResponse.json({ message: 'Invalid account details.', error: errorData.message }, { status: 400 });
    } else {
      console.log('Account Details are valid, moving on to transfer funds.');
    }

    const resolveAccountData = await resolveAccountResponse.json();
    const account_name = resolveAccountData.data.account_name;

    // Create a transfer recipient
    const createRecipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'nuban',
        name: account_name,
        account_number,
        bank_code,
        currency,
      }),
    });

    if (!createRecipientResponse.ok) {
      const errorData = await createRecipientResponse.json();
      return NextResponse.json({ message: 'Failed to create transfer recipient.', error: errorData.message }, { status: 400 });
    }

    const createRecipientData = await createRecipientResponse.json();
    const recipient_code = createRecipientData.data.recipient_code;

    // Initiate a transfer
    const transferResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: amount * 100, // Convert to kobo
        recipient: recipient_code,
        reason: 'User Withdrawal',
      }),
    });

    if (!transferResponse.ok) {
      const errorData = await transferResponse.json();
      console.log(errorData);
      return NextResponse.json(errorData, { status: 400 });
    }

    const withDrawalDataObject = {
      amount,
      date: Date.now(),
      status: 'completed',
      type: 'withdrawal',
      w_id: `${currentDbUser?.id}`
    }

    updateDocument('workers', `${currentDbUser?.docId}`, {balance: currentDbUser?.balance - (parseFloat(amount) / 50)})
    addDocument('activities', withDrawalDataObject);
    const transferData = await transferResponse.json();
    return NextResponse.json({
      message: 'Withdrawal successful!',
      transferDetails: transferData.data,
    });

  } catch (error) {
    console.error('Error processing withdrawal:', error.message);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
