'use client'

import { useEffect, useRef, useState } from 'react';
import { db } from '@/app/db/FirebaseConfig';
import {
    collection as fbCollection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    increment,
} from 'firebase/firestore';

export default function NewQuestionPage() {
    const [formData, setFormData] = useState({
        questions: [
            { question: '', options: ['', '', '', ''], answer: '', difficulty: '' }
        ],
    });
    const [collection, setCollection] = useState('gst');
    const [isLoading, setIsLoading] = useState(false);
    const lastQuestionRef = useRef(null);
    const messageRef = useRef(null);
    const [message, setMessage] = useState({ type: "", text: "" });

    const validate = () => {
        if (!collection.trim()) return "Select Collection is required.";
        if (formData.questions.length < 20) return "Questions must be at least 20";
        return null;
    };

    const resetForm = () => {
        setFormData({
            questions: [
                { question: '', options: ['', '', '', ''], answer: '', difficulty: '' }
            ],
        });
    };

    useEffect(() => {
        if (lastQuestionRef.current) {
            lastQuestionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [formData.questions.length]);

    const handleQuestionChange = (value, index, fieldIndex) => {
        const updatedQuestions = [...formData.questions];

        if (fieldIndex === 'question') {
            if (value.includes(';')) {
                const chunks = value.split(';');
                let i = index;
                for (let j = 0; j < chunks.length; j += 7) {
                    const q = chunks[j]?.trim();
                    const opts = chunks.slice(j + 1, j + 5).map(opt => opt?.trim());
                    const ans = chunks[j + 5]?.trim();
                    const diff = chunks[j + 6]?.trim();

                    if (!q || opts.length !== 4 || !ans || !diff) continue;

                    const newQ = {
                        question: q,
                        options: opts,
                        answer: ans,
                        difficulty: diff
                    };

                    if (i < updatedQuestions.length) {
                        updatedQuestions[i] = newQ;
                    } else {
                        updatedQuestions.push(newQ);
                    }
                    i++;
                }
                setFormData({ ...formData, questions: updatedQuestions });
                return;
            }
            updatedQuestions[index].question = value;
        } else if (fieldIndex === 'answer') {
            updatedQuestions[index].answer = value;
        } else if (fieldIndex === 'difficulty') {
            updatedQuestions[index].difficulty = value;
        } else {
            updatedQuestions[index].options[fieldIndex] = value;
        }

        setFormData({ ...formData, questions: updatedQuestions });
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { question: '', options: ['', '', '', ''], answer: '', difficulty: '' }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        const error = validate();
        if (error) {
            setMessage({ type: "error", text: error });
            messageRef.current?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        setIsLoading(true);

        try {
            const metaRef = doc(db, collection, '_meta');
            const metaSnap = await getDoc(metaRef);
            const metaData = metaSnap.data() || { lastBatchNumber: 1, totalQuestions: 0 };

            let batchNumber = metaData.lastBatchNumber || 1;
            let totalQuestions = metaData.totalQuestions || 0;
            let questionsToAdd = [...formData.questions];

            const currentBatchId = `summary_${batchNumber}`;
            const currentBatchRef = doc(db, collection, currentBatchId);
            const currentBatchSnap = await getDoc(currentBatchRef);
            const currentData = currentBatchSnap.exists() ? currentBatchSnap.data() : { batchNumber, questions: [] };
            let existingQuestions = currentData.questions || [];

            const questionsLeft = 1600 - existingQuestions.length;

            if (questionsToAdd.length <= questionsLeft) {
                // All questions can fit in current batch
                const updatedQuestions = [...existingQuestions, ...questionsToAdd];
                await setDoc(currentBatchRef, { batchNumber, questions: updatedQuestions });
                await updateDoc(metaRef, {
                    totalQuestions: totalQuestions + questionsToAdd.length,
                });
            } else {
                // Split between current and new batch
                const toCurrent = questionsToAdd.slice(0, questionsLeft);
                const toNext = questionsToAdd.slice(questionsLeft);

                await setDoc(currentBatchRef, {
                    batchNumber,
                    questions: [...existingQuestions, ...toCurrent],
                });

                const newBatchNumber = batchNumber + 1;
                const newBatchId = `summary_${newBatchNumber}`;
                const newBatchRef = doc(db, collection, newBatchId);

                await setDoc(newBatchRef, {
                    batchNumber: newBatchNumber,
                    questions: toNext,
                });

                await setDoc(metaRef, {
                    lastBatchNumber: newBatchNumber,
                    totalQuestions: totalQuestions + questionsToAdd.length,
                    createdAt: Date.now(),
                });
            }

            setMessage({ type: "success", text: "✅ Questions added successfully!" });
            resetForm();
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "❌ Error: " + err.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="textEditorForm">
            <div className="UnitInputCntn">
                <label>Select Collection :</label>
                <select name="Select Collection" value={collection} onChange={(e) => setCollection(e.target.value)}>
                    <option value="gst">General Studies</option>
                    <option value="art">Arts</option>
                    <option value="science">Science</option>
                    <option value="commerce">Commerce</option>
                </select>
            </div>

            <div className="questionSectCntn">
                {formData.questions.map((q, i) => (
                    <div key={i} ref={i === formData.questions.length - 1 ? lastQuestionRef : null} className='UnitQuestionCntn'>
                        <div className="unitQuestionInputCntn numeroUno">
                            <label>Question {i + 1} :</label>
                            <textarea
                                value={q.question}
                                onChange={(e) => handleQuestionChange(e.target.value, i, 'question')}
                            />
                        </div>

                        <div className="optionCntn">
                            {q.options.map((opt, j) => (
                                <div key={j} className="unitQuestionInputCntn">
                                    <label>Option {j + 1} :</label>
                                    <input
                                        value={opt}
                                        onChange={(e) => handleQuestionChange(e.target.value, i, j)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="unitQuestionInputCntn smally">
                            <label>Answer :</label>
                            <input
                                value={q.answer}
                                onChange={(e) => handleQuestionChange(e.target.value, i, 'answer')}
                            />
                        </div>
                        <div className="unitQuestionInputCntn smally">
                            <label>Difficulty :</label>
                            <input
                                value={q.difficulty}
                                onChange={(e) => handleQuestionChange(e.target.value, i, 'difficulty')}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {message.text && (
                <div
                    ref={messageRef}
                    className={`textEditorMsg ${message.type === "error" ? "error" : "msg"}`}
                >
                    {message.text}
                </div>
            )}

            <div className="flexIt">
                <button type="button" className="textEditorSubmitBtn" onClick={addQuestion}>Add Question</button>
                <button type="submit" className="textEditorSubmitBtn" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Questions'}
                </button>
            </div>
        </form>
    );
}
