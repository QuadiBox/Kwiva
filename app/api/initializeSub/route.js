import { NextResponse } from 'next/server';

export async function POST(req) {
  const url = 'https://api.paystack.co/transaction/initialize';
  const { email, amount } = await req.json();
  const base_url = process.env.NEXT_PUBLIC_BASE_URL

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      amount,
      callback_url: `${base_url}/request_complete`
    })
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
