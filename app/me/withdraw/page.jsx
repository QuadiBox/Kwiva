'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/app/db/FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { sendWelcomeEmail } from '@/app/email';

export default function WithdrawPage() {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        accountName: '',
        amount: 0,
        email: '',
        phone: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [buttonText, setButtonText] = useState('Validating...');
    const [isWinner, setIsWinner] = useState(false);
    const [winnerFromDB, setwinnerFromDB] = useState(null);
    const [hasBeenPaid, sethasBeenPaid] = useState(false);
    const router = useRouter();

    const rewardMap = {
        1: 1500000,
        2: 700000,
        3: 500000,
        4: 100000,
        5: 100000,
        6: 100000,
        7: 100000,
        8: 100000,
        9: 100000,
        10: 100000,
    };

    const html_to_mail = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Withdrawal Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .container {
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            max-width: 700px;
            width: 97%;
            margin: auto;
        }
        h2 {
            color: #C0BA82;
            text-transform: capitalize;
        }
        .field {
            margin-bottom: 10px;
        }
        .field p{
            font-size: 1.1em;
        }
        .label {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>A New Withdrawal Request from ${formData.accountName} </h2>
        <div class="field">
            <span class="label">Account name:</span> <span>${formData.accountName}</span>
        </div>
        <div class="field">
            <span class="label">Account Number:</span> <span>${formData.accountNumber}</span>
        </div>
        <div class="field">
            <span class="label">Bank Name:</span> <span>${formData.bankName}</span>
        </div>
        <div class="field">
            <span class="label">Amount:</span> <span>${formData.amount}</span>
        </div>
        <div class="field">
            <span class="label">Email:</span> <span>${formData.email ? formData.email : "Not Specified"}</span>
        </div>
        <div class="field">
            <span class="label">Phone Number:</span>
            <p>${formData.phone ? formData.phone : "Not Specified"}</p>
        </div>
    </div>
</body>
</html>
`

    useEffect(() => {
        const fetchWinnerAndSetAmount = async () => {
            if (!user) return;

            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const docId = `${month}-${year}`;

            try {
                const docRef = doc(db, 'winners', docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const winners = docSnap.data()?.winners || [];
                    setwinnerFromDB(docSnap.data())
                    const winnerEntry = winners.find(w => w.user_id === user.id);

                    if (winnerEntry) {
                        setIsWinner(true);
                        sethasBeenPaid(winnerEntry?.paid)
                        setFormData(prev => ({ ...prev, amount: winnerEntry ? rewardMap[winnerEntry.position] || 0 : 0 }));
                    }
                }
            } catch (err) {
                console.error('Error fetching winners:', err);
            } finally {
                setButtonText('Withdraw');
            }
        };

        fetchWinnerAndSetAmount();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        // Logic to submit withdrawal request
        const today = new Date();
        const date = today.getDate();
        const withinDateRange = date >= 25 && date <= 31;
        if (!withinDateRange) return;
        try {
            await sendWelcomeEmail(
                `"${formData.fName} from Kwiva." <${process.env.EMAIL_NAME}>`,
                'kwivaonline@gmail.com',
                `${formData?.accountName} wants to withdraw ${formData?.amount} to their ${formData?.bankName}`,
                `'A New Withdrawal Submission'`,
                html_to_mail
            );

            // If user is a winner, mark as paid in Firestore
            if (isWinner && user?.id && winnerFromDB?.winners?.length > 0) {
                const updatedWinners = winnerFromDB.winners.map((winner) => {
                    if (winner.user_id === user.id) {
                        return { ...winner, paid: true };
                    }
                    return winner;
                });

                const updatedWinnerDoc = {
                    ...winnerFromDB,
                    winners: updatedWinners,
                };

                const currentMonthId = `${new Date().getMonth() + 1}`.padStart(2, '0') + '-' + new Date().getFullYear();
                await setDoc(doc(db, 'winners', currentMonthId), updatedWinnerDoc);

                // Update local state too
                setwinnerFromDB(updatedWinnerDoc);
            }
        } catch (error) {
            console.error('Error sending widthdrawal request', err);
        }
        setFormData({
            bankName: '',
            accountNumber: '',
            accountName: '',
            amount: 0,
            email: '',
            phone: '',
        });
        router.push("/me")
        console.log('Submitting withdrawal:', formData);
        setSubmitting(false);

    };

    return (
        <div className='storyGrandCntn me'>
            <div className="withdrawFormCntn">
                <h2>Withdraw Your Reward</h2>
                <div className="preSect">
                    <Link href={"/"}>Home</Link>
                    <span><i className="icofont-rounded-right"></i></span>
                    <Link href={"/me"}>Me</Link>
                    <span><i className="icofont-rounded-right"></i></span>
                    <p>Withdraw</p>
                </div>
                <h3>
                    {isWinner
                        ? '🎊Congrats! Your effort this month paid off. Fill the form below to receive your reward.'
                        : '🚩You didn\'t make it to the top this month. Keep trying, your consistency will pay off!'
                    }

                </h3>
                {
                    hasBeenPaid && (
                        <h3>
                            You&apos;ve already submitted a withdrawal request. If you are yet to receive the money, reach out to us <a href="mailto:kwivaonline@gmail.com">@kwivaonline@gmail.com</a>
                        </h3>

                    )
                }
                {
                    isWinner && (
                        <p>⚠️ Withdrawals are processed in less than <b>4 hours</b> after submission and are sometimes instant.</p>
                    )
                }
                <form onSubmit={handleSubmit} className='withdrawForm'>
                    <div className="withdrawInputsCntn">
                        <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            placeholder="Bank Name (Opay)"
                            required
                        />
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            placeholder="Account Number (04***90)"
                            required
                        />
                        <input
                            type="text"
                            name="accountName"
                            value={formData.accountName}
                            onChange={handleChange}
                            placeholder="Account Name (John Doe)"
                            required
                        />
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            readOnly
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email (optional)"
                        />
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone (optional)"
                        />
                    </div>
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Processing...' : buttonText}
                    </button>
                </form>
            </div>

        </div>
    );
}
