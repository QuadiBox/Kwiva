'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleAd from '@/app/GoogleAd';
import Link from 'next/link';

export default function QuizQuestionPage({ number }) {
    const router = useRouter();
    const questionIndex = parseInt(number) - 1;
    const [quiz, setQuiz] = useState(null);
    const [quizAnswer, setQuizAnswer] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const storedQuiz = JSON.parse(localStorage.getItem('currentQuiz'));
        const storedAnswers = JSON.parse(localStorage.getItem('quizAnswer') || '[]');
        

        if (!storedQuiz) {
            router.replace('/quizzez');
            return;
        }

        if (Date.now() >= storedQuiz.stopTime) {
            router.replace('/quizzez');
            return;
        }

        setQuiz(storedQuiz);
        setQuizAnswer(storedAnswers);

        const initialTime = Math.floor((storedQuiz.stopTime - Date.now()) / 1000);
        setTimeLeft(initialTime);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.replace('/quizzez/result');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSelect = (selectedIndex) => {
        const updatedAnswers = [...quizAnswer];
        updatedAnswers[questionIndex] = selectedIndex + 1;
        setQuizAnswer(updatedAnswers);
        localStorage.setItem('quizAnswer', JSON.stringify(updatedAnswers));
    };

    if (!quiz) return null;

    const question = quiz.questions[questionIndex];
    const currentAnswer = quizAnswer[questionIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isLast = questionIndex === quiz.questions.length - 1;
    const isFirst = questionIndex === 0;

    return (
        <main className="quizPreviewCntn gap_var">
            <div className='quizTimer'>
                Time Left: <strong className={`${timeLeft <= 55 ? "alert" : ''}`}>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</strong>
            </div>

            <div className='theQuestionCntn'>
                <h2>Question {questionIndex + 1} :</h2>
                <p>{question?.question}</p>
            </div>

            <div className='theQuestionOptCntn'>
                {question?.options.map((opt, i) => (
                    <label key={i} className={`option ${currentAnswer === i + 1 ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name="option"
                            checked={currentAnswer === i + 1}
                            onChange={() => handleSelect(i)}
                            style={{ appearance: 'none', border: '2px solid #000000', borderRadius: '50%', width: '16px', height: '16px', marginRight: '8px', backgroundColor: currentAnswer === i + 1 ? 'black' : 'white' }}
                        />
                        <p style={{ display: 'inline' }}>{opt}</p>
                    </label>
                ))}
            </div>

            {/* Example ad component */}
            <div className="ad_slot">
                <GoogleAd key={`ad-qz-${quiz?.id}-${number}`} adKey={`ad-qz-${quiz?.id}-${number}`}></GoogleAd>
            </div>

            <div className='theQuestionNavCntn'>
                {!isFirst && <Link className='prev' href={`/quizzez/${quiz.id}/${questionIndex}`}>Prev</Link>}
                {!isLast ? (
                    <Link className='next' href={`/quizzez/${quiz?.id}/${questionIndex + 2}`}>Next</Link>
                ) : (
                    <Link className='next' href="/quizzez/result">See Result</Link>
                )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: 'auto', width: '100%', paddingTop: '2em' }}>
                {quiz.questions.map((_, i) => (
                    <Link
                        href={`/quizzez/${quiz.id}/${i + 1}`}
                        key={i}
                        className={`theQuestionnav_box ${quizAnswer[i] ? 'done' : ''} ${i === number - 1 ? 'currentQuest' : ''}`}
                    >
                        {i + 1}
                    </Link>
                ))}
            </div>
        </main>

    );
}
