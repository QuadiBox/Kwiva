'use client';
import React, { useEffect, useRef, useState } from 'react';
import GoogleAd from '../GoogleAd';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../db/FirebaseConfig';

const StoryContent = ({ htmlContent }) => {
    // Split HTML string at each [AD] marker
    const sections = htmlContent;

    const slotIds = [
        '5983480416', // slot for ad 1
        '5983480416', // slot for ad 2
        '5983480416', // slot for ad 3
        // repeat or add more as needed
    ];

    const articleRef = useRef(null);

    // Store which checkpoints have been reached (25%, 50%, 75%, 100%)
    const [checkpointsReached, setCheckpointsReached] = useState(new Set());

    // Store the timestamp of the last checkpoint hit (to enforce time gap)
    const [lastCheckpointTime, setLastCheckpointTime] = useState(Date.now());

    // Track total time user has spent on this page (in seconds)
    const [readingTime, setReadingTime] = useState(0);

    // Whether the user has completed the full reading process
    const [readingComplete, setReadingComplete] = useState(false);

    const { user } = useUser();

    // 📌 On mount, mark readingComplete as false in localStorage
    useEffect(() => {
        localStorage.setItem('readingComplete', 'false');
    }, []);

    // Main scroll + timer effect
    useEffect(() => {
        // 1️⃣ Start a timer that increases reading time every second
        let timer = setInterval(() => {
            setReadingTime(prev => prev + 1);
        }, 1000);

        // 2️⃣ Handle scroll progress tracking
        const handleScroll = () => {
            if (!articleRef.current) return;

            const articleHeight = articleRef.current.scrollHeight; // Total content height
            const scrollTop = window.scrollY; // Current scroll position
            const viewportHeight = window.innerHeight; // Browser visible height

            // % of article read
            const scrollPercent = ((scrollTop + viewportHeight) / articleHeight) * 100;

            const now = Date.now();
            const checkpoints = [25, 50, 75, 100]; // Define checkpoints in %

            for (let cp of checkpoints) {
                // Condition: User passes checkpoint, hasn't passed before, waited ≥5s since last checkpoint
                if (
                    scrollPercent >= cp &&
                    !checkpointsReached.has(cp) &&
                    now - lastCheckpointTime >= 5000
                ) {
                    setCheckpointsReached(prev => new Set(prev).add(cp));
                    setLastCheckpointTime(now);
                }
            }
        };

        // Listen for scroll events
        window.addEventListener('scroll', handleScroll);

        return () => {
            clearInterval(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [checkpointsReached, lastCheckpointTime]);

    // 3️⃣ Determine when reading is truly complete
    useEffect(() => {
        // Require at least 30 seconds total + all checkpoints reached
        if (readingTime >= 30 && checkpointsReached.size === 4) {
            setReadingComplete(true);
        }
    }, [readingTime, checkpointsReached]);

    // 4️⃣ Award points when readingComplete is true
    useEffect(() => {
        if (readingComplete) {
            localStorage.setItem('readingComplete', 'true');

            const updatePoints = async () => {
                if (!user) return; // User not logged in, skip

                const userId = user.id;

                // Retrieve cached user data
                const cachedUserStr = localStorage.getItem(`user_${userId}`);
                let userData;

                if (cachedUserStr) {
                    userData = JSON.parse(cachedUserStr);
                } else {
                    // No cached data → fetch from Firestore
                    const userDocRef = doc(db, 'users', userId);
                    const userDocSnap = await getDoc(userDocRef);
                    if (!userDocSnap.exists()) {
                        console.warn('User document does not exist!');
                        return;
                    }
                    userData = userDocSnap.data();

                    // Cache for next time
                    localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
                }

                // Increment points in local object
                const newPoints = (userData.points || 0) + 10;
                userData.points = newPoints;

                // 1️⃣ Update in `users` collection
                const userDocRef = doc(db, 'users', userId);
                await updateDoc(userDocRef, { points: increment(10) });

                // 2️⃣ Update in `userlist` collection using summaryDocId
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

                // 3️⃣ Update cache
                localStorage.setItem(`user_${userId}`, JSON.stringify(userData));
            };

            updatePoints().catch((err) => console.error('Error updating points:', err));
        }
    }, [readingComplete, user]);


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
                    {index < sections.length - 1 && <GoogleAd key={`google-ad-${index}`} adKey={`google-ad-${index}`} slot={slotIds[index % slotIds.length]} />}
                </React.Fragment>
            ))}

            {/* <span className='goBackToTop'><p>Go back to top & Scroll gently</p></span> */}
        </article>
    );
};

export default StoryContent;
