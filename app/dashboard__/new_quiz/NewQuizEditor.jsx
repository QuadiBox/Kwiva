'use client'

import { useEffect, useRef, useState } from 'react';
import { db } from '@/app/db/FirebaseConfig';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    increment,
} from 'firebase/firestore';

export default function NewQuizPage() {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        description: '',
        duration: '30',
        questions: [
            { question: '', options: ['', '', '', ''], answer: '' }
        ],
        createdAt: Date.now(),
    });

    const [isLoading, setIsLoading] = useState(false);
    const lastQuestionRef = useRef(null);
    const messageRef = useRef(null);

    const [message, setMessage] = useState({ type: "", text: "" });

    const validate = () => {
        if (!formData.title.trim()) return "Title is required.";
        if (!formData.id.trim()) return "Id is required.";
        if (!formData.description.trim()) return "Description is required.";
        if (!formData.duration.trim()) return "Duration is required.";
        if (formData.questions.length < 19) return "Questions must be atleast 20 ";
        return null;
    };

    const resetForm = (vlad) => {
        setFormData((prev) => ({
            ...prev,
            id: `qz_${vlad + 1}`,
            title: '',
            description: '',
            duration: '30',
            questions: [
                { question: '', options: ['', '', '', ''], answer: '' }
            ],
            createdAt: Date.now(),
        }));
    };

    useEffect(() => {
        const fetchNextId = async () => {
            const metaSnap = await getDoc(doc(db, 'quizlist', '_meta'));
            const totalQuizzez = metaSnap.data()?.totalQuizzez || 0;
            const nextId = `qz_${totalQuizzez + 1}`;
            setFormData(prev => ({ ...prev, id: nextId }));
        };
        fetchNextId();
    }, []);

    useEffect(() => {
        if (lastQuestionRef.current) {
            lastQuestionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [formData.questions.length]);

    const handleQuestionChange = (value, index, fieldIndex) => {
        const updatedQuestions = [...formData.questions];
        if (fieldIndex === 'question') {
            updatedQuestions[index].question = value;
        } else if (fieldIndex === 'answer') {
            updatedQuestions[index].answer = value;
        } else {
            updatedQuestions[index].options[fieldIndex] = value;
        }
        setFormData({ ...formData, questions: updatedQuestions });

        if (fieldIndex === 'question' && value.includes(';')) {
            const chunks = value.split(';');
            let i = index;
            for (let j = 0; j < chunks.length; j += 6) {
                const q = chunks[j];
                const opts = chunks.slice(j + 1, j + 5);
                const ans = chunks[j + 5];
                if (!q) continue;

                const newQ = {
                    question: q,
                    options: opts.length === 4 ? opts : ['', '', '', ''],
                    answer: ans || ''
                };

                if (i < formData.questions.length) {
                    updatedQuestions[i] = newQ;
                } else {
                    updatedQuestions.push(newQ);
                }
                i++;
            }
            setFormData({ ...formData, questions: updatedQuestions });
        }
    };

    const addQuestion = () => {
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, { question: '', options: ['', '', '', ''], answer: '' }]
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
            const quizId = formData.id;
            const metaRef = doc(db, 'quizlist', '_meta');
            const metaSnap = await getDoc(metaRef);
            const metaData = metaSnap.data();
            const lastBatchNumber = metaData?.lastBatchNumber || 1;
            const summaryDocId = `summary_${lastBatchNumber}`;

            const summaryRef = doc(db, 'quizlist', summaryDocId);
            const summarySnap = await getDoc(summaryRef);
            const summaryData = summarySnap.data();
            const quizzezArray = summaryData?.quizzez || [];

            if (quizzezArray.length >= 1000) {
                const newBatch = lastBatchNumber + 1;
                await setDoc(doc(db, 'quizlist', `_meta`), {
                    ...metaData,
                    lastBatchNumber: newBatch,
                    totalQuizzez: (metaData?.totalQuizzez || 0) + 1,
                });

                await setDoc(doc(db, 'quizlist', `summary_${newBatch}`), {
                    batchNumber: newBatch,
                    quizzez: [{
                        id: quizId,
                        title: formData.title,
                        description: formData.description,
                        duration: parseInt(formData.duration, 10),
                        createdAt: Date.now(),
                        count: formData.questions.length
                    }]
                });
            } else {
                quizzezArray.push({
                    id: quizId,
                    title: formData.title,
                    description: formData.description,
                    duration: parseInt(formData.duration, 10),
                    createdAt: Date.now(),
                    count: formData.questions.length
                });

                await updateDoc(summaryRef, { quizzez: quizzezArray });
                await updateDoc(metaRef, {
                    totalQuizzez: increment(1)
                });
            }

            await setDoc(doc(db, 'quizzez', quizId), {
                ...formData,
                duration: parseInt(formData.duration, 10),
                summaryDocId: summaryDocId
            });

            setMessage({ type: "success", text: "✅ Quiz Added successfully!" });
            resetForm((metaData?.totalQuizzez || 0));
        } catch (error) {
            console.error('Error posting quiz:', error);
            setMessage({ type: "error", text: "❌ Error: " + err.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="textEditorForm">
            <div className="UnitInputCntn">
                <label>Title</label>
                <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="dualInputCntn">
                <div className="UnitInputCntn">
                    <label>Quiz ID (auto-filled): </label>
                    <input type="text" value={formData.id} readOnly />
                </div>
                <div className="UnitInputCntn">
                    <label>Duration (in minutes):</label>
                    <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                </div>
            </div>

            <div className="UnitInputCntn">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
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
                    </div>
                ))}

            </div>

            {message.text && (
                <div
                    ref={messageRef}
                    className={`textEditorMsg ${message.type === "error"
                        ? "error"
                        : "msg"
                        }`}
                >
                    {message.text}
                </div>
            )}
            <div className="flexIt">
                <button type="button" className="textEditorSubmitBtn" onClick={addQuestion}>Add Question</button>
                <button type="submit" className="textEditorSubmitBtn" disabled={isLoading}>{isLoading ? 'Posting...' : 'Post Quiz'}</button>
            </div>
        </form>
    );
}
