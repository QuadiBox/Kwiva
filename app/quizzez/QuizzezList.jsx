'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function QuizWrapper({ serverData }) {
    const [story, setStory] = useState(serverData);
    const [storyOrder, setStoryOrder] = useState('descending');

    const sortHistoryList = () => {

        const getTime = (val) => {
            if (typeof val === "number") return val;
            if (val && typeof val.toDate === "function") return val.toDate().getTime(); // Firestore Timestamp
            if (typeof val === "string") return new Date(val).getTime();
            return 0;
        };

        return story.sort((a, b) => {
            const timeA = getTime(a.createdAt);
            const timeB = getTime(b.createdAt);
            return storyOrder === "ascending" ? timeA - timeB : timeB - timeA;
        });
    }

    const sortedHistoryList = sortHistoryList();
 

    return (
        <main className='historiesGrandCntn'>
            <div className="historyListHeader">
                <h2>All Quizzez</h2>
                <button type="button" id='marginAutoLeft' className='blackBtn motherBtn'>
                    Sort

                    <div className="childDisplay">
                        <h3>Sort By:</h3>
                        <div onClick={() => {setStoryOrder('descending')}}>Newest to Oldest {storyOrder === 'descending' && (<i className="icofont-check-alt"></i>)}</div>
                        <div onClick={() => {setStoryOrder('ascending')}}>Oldest to Newest {storyOrder === 'ascending' && (<i className="icofont-check-alt"></i>)}</div>
                    </div>
                </button>
            </div>
            <div className="historiesCntn">
                {
                    sortedHistoryList.map((elem) => (
                        <div key={`historyList_${elem?.id}`} className="unitHistoryCntn">
                            <div className="historyHead">
                                <img src="/quizzez_1.png" alt="Quizzez image" />
                                <Link href={`/quizzez/${elem?.id}`} className="historyheadings">
                                    <h3>{elem?.title}</h3>
                                </Link>
                            </div>
                            <p>{elem?.description}</p>
                            <div className="historyFooter">
                                <p>Duration: <span>{elem?.duration} mins</span></p>
                                <Link href={`/quizzez/${elem?.id}`}><i className="icofont-electron"></i></Link>
                            </div>
                        </div>

                    ))
                }
                
            </div>
        </main>
    );
}
