'use client';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/FirebaseConfig"; // Adjust path as needed

const SearchBtn = ({ setShowSearch, compType }) => {
    const [loading, setLoading] = useState(false);
    const localStorageKey = compType === 'story' ? "storySearchList" : "blogSearchList";
    const dbCollectionKey = compType === 'story' ? 'storylist' : 'bloglist';

    const handleArticleFetchAndStorage = async () => {
        setLoading(true);
        const cached = localStorage.getItem(localStorageKey);
        let useCache = false;

        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Date.now() < parsed.expiryTime) {
                    useCache = true;
                }
            } catch (err) {
                console.warn("Invalid cached search data:", err);
            }
        }

        if (!useCache) {
            try {
                const snap = await getDocs(collection(db, dbCollectionKey));
                const articles = [];

                snap.forEach((docSnap) => {
                    if (docSnap.id !== '_meta') {
                        const data = docSnap.data();
                        if (Array.isArray(data.articles)) {
                            articles.push(...data.articles);
                        }
                    }
                });

                const payload = {
                    articles,
                    expiryTime: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
                };
                localStorage.setItem(localStorageKey, JSON.stringify(payload));
            } catch (error) {
                console.error("Error fetching search data:", error);
            }
        }
        setLoading(false);
        setShowSearch(true);
    };

    return (
        <button
            type="button"
            onClick={handleArticleFetchAndStorage}
            className="searchBtn"
        >
            {
                loading ? (<i id="searchSpinner" className="icofont-spinner-alt-2"></i>) : (
                    <i className="icofont-search-1"></i>
                )
            }
        </button>
    );
};

export default SearchBtn;
