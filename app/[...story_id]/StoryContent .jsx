'use client';
import React, { useEffect, useRef, useState } from 'react';
import GoogleAd from '../GoogleAd';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../db/FirebaseConfig';

const StoryContent = ({ htmlContent }) => {
    const articleRef = useRef(null);
    const [timerDone, setTimerDone] = useState(false);
    const [articleFullyRead, setArticleFullyRead] = useState(false);

    const { user } = useUser();

    // Split HTML string at each [AD] marker
    const sections = htmlContent;

    const slotIds = [
        '1234567890', // slot for ad 1
        '2345678901', // slot for ad 2
        '3456789012', // slot for ad 3
        // repeat or add more as needed
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimerDone(true);
        }, 30000);

        const handleScroll = () => {
            if (!articleRef.current) return;

            const rect = articleRef.current.getBoundingClientRect();
            const bottomDistance = window.innerHeight - rect.bottom;

            if (bottomDistance >= 0) {
                setArticleFullyRead(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Track previous URL to detect if user is navigating away
    useEffect(() => {
        // On mount, set this page's tracking
        localStorage.setItem('readingComplete', 'false');
    }, []);

    useEffect(() => {
        if (timerDone && articleFullyRead) {
            localStorage.setItem('readingComplete', 'true');

            const updatePoints = async () => {
                if (!user) return; // user not logged in, no updates needed

                const userId = user.id;

                // Check if we have user data cached in localStorage
                const cachedUserStr = localStorage.getItem(`user_${userId}`);
                let userData;

                if (cachedUserStr && cachedUserStr?.id === userId) {
                    userData = JSON.parse(cachedUserStr);
                } else {
                    // No cached user data, fetch from Firestore
                    const userDocRef = doc(db, 'users', userId);
                    const userDocSnap = await getDoc(userDocRef);
                    if (!userDocSnap.exists()) {
                        console.warn('User document does not exist!');
                        return;
                    }
                    userData = userDocSnap.data();

                    // Cache for future use — no expiry since these rarely change
                    localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
                }

                // Increment points locally and on Firestore
                const newPoints = (userData.points || 0) + 10;
                userData.points = newPoints;

                // 1️⃣ Update in users collection
                const userDocRef = doc(db, 'users', userId);
                await updateDoc(userDocRef, { points: increment(10) });

                // 2️⃣ Update in userlist collection using summaryDocId
                const summaryDocId = userData.summaryDocId;
                if (!summaryDocId) {
                    console.warn('No summaryDocId found in user data');
                    return;
                }

                const summaryDocRef = doc(db, 'userlist', summaryDocId);
                const summaryDocSnap = await getDoc(summaryDocRef);
                if (!summaryDocSnap.exists()) {
                    console.warn('Summary doc not found!');
                    return;
                }

                const summaryData = summaryDocSnap.data();
                const updatedUsers = summaryData.users.map((u) =>
                    u.user_id === userId ? { ...u, points: (u.points || 0) + 10 } : u
                );

                await updateDoc(summaryDocRef, { users: updatedUsers });

                // 3️⃣ Update localStorage for faster next usage
                localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
            };

            updatePoints().catch((err) => console.error('Error updating points:', err));
        }
    }, [timerDone, articleFullyRead, user]);

    // Before unmount (page change), store the final reading state
    useEffect(() => {
        const setLastReadingComplete = () => {
            const readingComplete = localStorage.getItem('readingComplete');
            localStorage.setItem('lastPageReadingComplete', readingComplete);
        };

        const handleBeforeUnload = () => {
            setLastReadingComplete();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // ✅ Also set on unmount (for Next.js client-side navigations)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            setLastReadingComplete();
        };
    }, []);


    return (
        <article ref={articleRef} className="storyArticleCntn">
            {sections?.map((section, index) => (
                <React.Fragment key={index}>
                    <section dangerouslySetInnerHTML={{ __html: section }} />
                    {/* Insert GoogleAd component except after the last section */}
                    {index < sections.length - 1 && <GoogleAd key={`google-ad-${index}`} adKey={`google-ad-${index}`} slot={slotIds[index % slotIds.length]}/>}
                </React.Fragment>
            ))}

        </article>
    );
};

export default StoryContent;
