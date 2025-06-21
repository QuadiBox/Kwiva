"use client"

import React from 'react'

const Startbutton = ({ dbData, quizId }) => {
    return (
        <button
            onClick={() => {
                if (typeof window !== 'undefined') {
                    const stopTime = Date.now() + dbData?.duration * 60 * 1000;
                    const enrichedQuiz = { ...dbData, stopTime };
                    localStorage.setItem('currentQuiz', JSON.stringify(enrichedQuiz));
                    localStorage.setItem('quizAnswer', JSON.stringify([]));
                    window.location.href = `/quizzez/${quizId}/1`;
                }
            }}
            className='startQuizBtn'
            role='link'
        >
            Start Quiz
        </button>
    )
}

export default Startbutton
