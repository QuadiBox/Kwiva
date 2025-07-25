'use client'

import { useEffect, useState } from "react"
import { db } from "../db/FirebaseConfig";
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { fetchDocumentById } from "../db/firestoreService";

const Page = () => {
    const [testQuestions, setTestQuestions] = useState("loading");
    
    useEffect(() => {
        const correctQuestionAnswer = async (questionText, newAnswer) => {
            if (!questionText ||  !newAnswer) {
                throw new Error('Invalid parameters. Expecting (questionText: string, newAnswer: number)');
            }
            console.log("how far e dey work");
            
    
            const metaRef = doc(db, 'gst', '_meta');
            const metaSnap = await getDoc(metaRef);
    
            if (!metaSnap.exists()) {
                console.error('_meta document not found in gst collection');
                return;
            }
    
            setTestQuestions('loading');
            const lastBatch = metaSnap.data().lastBatchNumber;
    
            for (let i = 1; i <= lastBatch; i++) {
                const docRef = doc(db, 'gst', `summary_${i}`);
                const docSnap = await getDoc(docRef);
                
                if (!docSnap.exists()) continue;
                setTestQuestions('fecthed now finding matching question');
    
                const data = docSnap.data();
                const updatedQuestions = [...data.questions];
                let foundIndex = -1;
    
                for (let j = 0; j < updatedQuestions.length; j++) {
                    if (
                        updatedQuestions[j].question.trim().toLowerCase() === questionText.trim().toLowerCase()
                    ) {
                        foundIndex = j;
                        break;
                    }
                }
    
                if (foundIndex !== -1) {
                    setTestQuestions('question found');
                    updatedQuestions[foundIndex].answer = newAnswer;
    
                    await updateDoc(docRef, { questions: updatedQuestions });
                    setTestQuestions('question updated succesfully');
                    console.log(`✅ Answer updated in summary_${i} at question: ${foundIndex + 1}`);
                    return;
                }
            }
    
            console.warn('❌ Question not found in any summary document.');
        }
        correctQuestionAnswer("What is the longest river in the world?", "1");
    }, []);
    return (
        <div style={{ fontSize: "2em", color: "black", width: "100vw" }}>
            <p>{testQuestions}</p>
        </div>
    )
}

export default Page
