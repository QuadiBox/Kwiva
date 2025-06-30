'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/app/db/FirebaseConfig';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import GoogleAd from '@/app/GoogleAd';

export default function QuizResultPage() {
    const router = useRouter();
    const [points, setPoints] = useState(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [details, setDetails] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const storedQuiz = JSON.parse(localStorage.getItem('currentQuiz'));
        const storedAnswers = JSON.parse(localStorage.getItem('quizAnswer') || '[]');

        if (!storedQuiz || !storedAnswers) {
            router.replace('/quizzez');
            return;
        }

        const correct = storedQuiz.questions.reduce((acc, q, i) => {
            return acc + (storedAnswers[i] === parseInt(q.answer) ? 1 : 0);
        }, 0);

        const basePoints = 10;
        const earnedPoints = correct * 1;
        const total = basePoints + earnedPoints;

        console.log(correct);
        

        setPoints(total);
        setCorrectCount(correct);
        setTotalQuestions(storedQuiz.questions.length);
        setDetails({ basePoints, earnedPoints });

        if (!user) {
            console.log("Kindly log in");
            return;
        }

        const updatePoints = async () => {
            const userRef = doc(db, 'users', user.id);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) return;

            await updateDoc(userRef, { points: increment(total) });

            const userData = userSnap.data();
            const summaryDocId = userData.summaryDocId;
            if (summaryDocId) {
                const summaryRef = doc(db, 'userlist', summaryDocId);
                const summarySnap = await getDoc(summaryRef);
                if (summarySnap.exists()) {
                    const batchData = summarySnap.data();
                    const updatedUsers = batchData.users.map((u) =>
                        u.user_id === user.id ? { ...u, points: u.points + total } : u
                    );
                    await updateDoc(summaryRef, { users: updatedUsers });
                }
            }

            localStorage.setItem('currentQuiz', JSON.stringify({}));
            localStorage.setItem('quizAnswer', JSON.stringify([]));
        };

        updatePoints();
    }, [user]);

    if (points === null || !details) return null;

    return (
        <main className="resultCntn">
            <div className='fancyPointDIV'>
                <h1>
                    <strong>
                        {points}
                    </strong> 
                    <b>Total Points</b>
                </h1>
                <div className='fancyBlob uno' aria-hidden></div>
                <div className='fancyBlob dos' aria-hidden></div>
            </div>
            <div className='resultDetails'>
                <p>Base Points → <span>{details.basePoints} points</span></p>
                <p>
                    Correct Answers → <span>{correctCount} / {totalQuestions}</span>
                </p>
                <p>Points Earned → <span>{details.earnedPoints} points</span> for correct answers</p>
            </div>
            {/* Example ad component */}
            <div className="theResultADSlot">
                <GoogleAd></GoogleAd>
            </div>
            <Link href="/quizzez" className='quizDoneBtn'>Done</Link>

            <SignedOut>
                <div className="notLoggedInResultBox">
                    <h2>You&apos;re not signed in!</h2>
                    <p>You&apos;re missing on incredible prizes, these points earned are not saved and does not accumulate.</p>
                    <SignInButton></SignInButton>
                </div>
            </SignedOut>

        </main>
    );
}
