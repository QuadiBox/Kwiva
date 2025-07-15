'use client'
import { useState, useEffect } from "react";
import { db } from "@/app/db/FirebaseConfig";
import { increment, getDoc, collection, getDocs } from "firebase/firestore";
import GoogleAd from "@/app/GoogleAd";

const GSTClientComponent = () => {
    const [difficulty, setDifficulty] = useState('random');
    const [questionCount, setQuestionCount] = useState(20);
    const [quizDuration, setQuizDuration] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (difficulty === "random") {
            setQuizDuration(questionCount * 18)
        } else if (difficulty === "easy") {
            setQuizDuration(questionCount * 20)
        } else if (difficulty === "medium") {
            setQuizDuration(questionCount * 15)
        } else if (difficulty === "hard") {
            setQuizDuration(questionCount * 11)
        }
    }, [difficulty, questionCount])


    const handleQuestionPrep = async () => {
        if (typeof window === 'undefined') return;
        const STORAGE_KEY = 'gst';
        const EXPIRY_HOURS = 24 * 1;
        const cached = localStorage.getItem(STORAGE_KEY);
        let giantArray = [];
        let expiryTime = 0;
        setLoading(true);

        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                expiryTime = parsed.expiryTime || 0;
                if (Date.now() < expiryTime) {
                    giantArray = parsed.questions;
                }
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }

        if (!giantArray.length) {
            const querySnapshot = await getDocs(collection(db, STORAGE_KEY));
            let allQuestions = [];
            querySnapshot.forEach((docSnap) => {
                if (docSnap.id === '_meta') return;
                const data = docSnap.data();
                allQuestions = allQuestions.concat(data.questions || []);
            });

            giantArray = allQuestions;
            expiryTime = Date.now() + EXPIRY_HOURS * 60 * 60 * 1000;
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ questions: giantArray, expiryTime }));
        }

        // Filtering based on difficulty
        let questionPool = [];
        if (difficulty === 'random') {
            questionPool = [...giantArray];
        } else {
            questionPool = giantArray.filter(q => q.difficulty === difficulty);
        }

        // Shuffle function for randomness
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        questionPool = shuffleArray(questionPool);

        // Unique random pick, avoid repeat in one session
        const selectedQuestions = questionPool.slice(0, questionCount);

        // Generate quizId for uniqueness (can be timestamp or random string)
        const quizId = `gst_${Date.now()}`;

        // Prepare for localStorage
        const dbData = {
            quizId,
            collection: 'gst',
            difficulty,
            questions: selectedQuestions,
            totalQuestions: selectedQuestions.length,
            duration: quizDuration,
        };
        //get "gst" from localStorage
        //if not available or it's expiryTime value hass been exceeded, fetch all document that's not _meta from gst collection on firestore
        //flatten questions array from gst collection documents to get a giant array of objects and update the localStorage gst by seting the giant array as the questions field and expiryTime set to 3 days from Date.now() 
        //use difficulty value to perform some logic


        //set the duration and update currentQuiz and quizAnswer localstorage values.
        const stopTime = Date.now() + quizDuration * 1000;
        const enrichedQuiz = { ...dbData, stopTime };
        localStorage.setItem('currentQuiz', JSON.stringify(enrichedQuiz));
        localStorage.setItem('quizAnswer', JSON.stringify([]));
        setLoading(true);
        window.location.href = `/quizzez/gst/1`;
    }

    const minutes = Math.floor(quizDuration / 60);
    const seconds = quizDuration % 60;

    return (
        <>
            <div className="specialDurationCntn">
                <p>Count: </p>
                <div className="durationeditorCntn">
                    <button onClick={() => { setQuestionCount((prev) => prev <= 20 ? 20 : prev - 2) }} type="button" className='subtract'>-2</button>
                    <input value={questionCount} readOnly type="number" name="duration" id="duration" max="60" min="20" maxLength={2} />
                    <button onClick={() => { setQuestionCount((prev) => prev >= 60 ? 60 : prev + 2) }} type="button" className='add'>+2</button>
                </div>
            </div>
            <div className="difficultyEditorCntn">
                <p>Difficulty:</p>
                <div className="difficultyCntn">
                    <button type="button" className={`${difficulty === 'random' ? 'activeDifficulty' : ""}`} onClick={() => { setDifficulty('random') }}>Random</button>
                    <button type="button" className={`${difficulty === 'easy' ? 'activeDifficulty' : ""}`} onClick={() => { setDifficulty('easy') }}>Easy</button>
                    <button type="button" className={`${difficulty === 'medium' ? 'activeDifficulty' : ""}`} onClick={() => { setDifficulty('medium') }}>Medium</button>
                    <button type="button" className={`${difficulty === 'hard' ? 'activeDifficulty' : ""}`} onClick={() => { setDifficulty('hard') }}>Hard</button>
                </div>
            </div>
            <p>Duration: {minutes.toString().padStart(2, '0')}<sub>m</sub>{seconds.toString().padStart(2, '0')}<sub>s</sub></p>

            {/* Example ad component */}
            <div className="ad_slot">
                <GoogleAd key={`ad-qz-gst-start`} adKey={`ad-qz-gst-start`}></GoogleAd>
            </div>

            <button
                onClick={handleQuestionPrep}
                className='startQuizBtn'
                role='link'
            >
                {loading ? "Processing..." : "Start Quiz"}
            </button>
        </>
    )
}

export default GSTClientComponent
