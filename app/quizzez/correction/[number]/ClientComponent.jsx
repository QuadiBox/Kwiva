'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import GoogleAd from '@/app/GoogleAd';
import Link from 'next/link';

export default function QuizQuestionPage({ number }) {
    const router = useRouter();
    const questionIndex = parseInt(number) - 1;
    const [quiz, setQuiz] = useState(null);
    const [quizAnswer, setQuizAnswer] = useState([]);

    useEffect(() => {
        const storedQuiz = JSON.parse(localStorage.getItem('correctionQuiz'));
        const storedAnswers = JSON.parse(localStorage.getItem('correctionAnswers') || '[]');

        if (!storedQuiz) {
            router.replace('/quizzez');
            return;
        }
        
        
        setQuiz(storedQuiz);
        setQuizAnswer(storedAnswers);

    }, []);

    if (!quiz) return null;

    const question = quiz?.questions[questionIndex];
    const currentAnswer = quizAnswer[questionIndex];
    const isLast = questionIndex === quiz?.questions.length - 1;
    const isFirst = questionIndex === 0;

    return (
        <main className="quizPreviewCntn gap_var">
            <div className='theQuestionCntn'>
                <h2>Question {questionIndex + 1} :</h2>
                <p>{question?.question}</p>
            </div>

            <div className='theQuestionOptCntn'>
                {question?.options.map((opt, i) => {
                    let extraClass = '';
                    const answerNumber = question?.answer; // answer is 1-4
                    if (currentAnswer == i + 1 && currentAnswer == answerNumber) {
                        extraClass = 'right';
                    } else if (currentAnswer == i + 1 && currentAnswer !== answerNumber) {
                        extraClass = 'wrong';
                        
                    } else if (i + 1 == answerNumber) {
                        extraClass = 'right';
                    }

                    return (
                        <label key={i} className={`option ${extraClass}`}>
                            <span className='option'></span>
                            <p style={{ display: 'inline' }}>{opt}</p>
                        </label>
                    );
                })}
            </div>

            <div className="ad_slot">
                <GoogleAd key={`ad-qz-correction-${number}`} adKey={`ad-qz-correction-${number}`} />
            </div>

            <div className='theQuestionNavCntn'>
                {!isFirst && <Link className='prev' href={`/quizzez/correction/${questionIndex}`}>Prev</Link>}
                {!isLast ? (
                    <Link className='next' href={`/quizzez/correction/${questionIndex + 2}`}>Next</Link>
                ) : (
                    <Link className='next' href="/quizzez">Done</Link>
                )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: 'auto', width: '100%', paddingTop: '2em' }}>
                {quiz.questions.map((q, i) => {
                    const ans = quizAnswer[i];
                    let extraClass = '';
                    if (ans == q.answer) {
                        extraClass = 'right';
                    } else {
                        extraClass = 'wrong';
                    }
                    return (
                        <Link
                            href={`/quizzez/correction/${i + 1}`}
                            key={i}
                            className={`theQuestionnav_box ${extraClass} ${i === questionIndex ? 'currentQuest' : ''}`}
                        >
                            {i + 1}
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}