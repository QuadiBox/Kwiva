'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SearchComponent({ onClose, compType }) {
    const [searchData, setSearchData] = useState([]);
    const [query, setQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const localStorageKey = compType === 'story' ? "storySearchList" : "blogSearchList";

    // Fetch search list from localStorage
    useEffect(() => {
        try {
            const cached = JSON.parse(localStorage.getItem(localStorageKey));
            if (cached && Date.now() < cached.expiryTime) {
                setSearchData(cached.articles || []);
            }
        } catch (e) {
            console.error('Invalid search cache:', e);
        }
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setFilteredResults([]);
            return;
        }

        const q = query.toLowerCase();
        const results = searchData.filter(({ title, subtitle }) =>
            title.toLowerCase().includes(q) || subtitle.toLowerCase().includes(q)
        );
        setFilteredResults(results);
    }, [query, searchData]);

    // Highlights matching text
    const highlightMatch = (text, keyword) => {
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.split(regex).map((chunk, i) =>
            chunk.toLowerCase() === keyword.toLowerCase() ? (
                <span key={i} id="highlight">
                    {chunk}
                </span>
            ) : (
                <span key={i} id="normal">
                    {chunk}
                </span>
            )
        );
    };

    return (
        <div className="searchOverlay">
            <div className="searchBox">
                <button className="searchcloseBtn" onClick={onClose}><i className="icofont-close"></i></button>
                <input
                    type="text"
                    className="searchInput"
                    placeholder={compType === 'story' ? "Search Short Histories..." : 'Search Blogs'}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />

                <div className="searchResults">
                    {!query && (
                        <p className="placeholderText">
                            Type the story you wish to search for in the search bar above.
                        </p>
                    )}

                    {query && filteredResults.length === 0 && (
                        <p className="placeholderText">
                            No search result for &quot;<strong>{query}</strong>&quot;
                        </p>
                    )}

                    {filteredResults.map((item, idx) => (
                        <Link key={`searchResultItem__${idx}`} href={`${item?.id.startsWith("s") ? `/${item?.id}` : `/blogs/${item?.id}`}`} className="resultItem">
                            {/* <div className="resultTitle">
                                {highlightMatch(item.title, query)}
                            </div>
                            <div className="resultSubtitle">
                                {highlightMatch(item.subtitle, query)}
                            </div> */}
                            <div className="historyHead">
                                <img src={compType === 'story' ? "/stories_1.png": "/blogs_1.png"} alt="history image" />
                                <div className="historyheadings">
                                    <h3>{highlightMatch(item.title, query)}</h3>
                                    {
                                        item?.subtitle && (
                                            <h4>{highlightMatch(item.subtitle, query)}</h4>
                                        )
                                    }
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
