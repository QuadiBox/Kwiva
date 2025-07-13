'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchBtn from './SearchBtn';
import SearchComponent from './SearchComponent';

export default function ArticleWrapper({ serverData, compType, ImgType }) {
    const [storyOrder, setStoryOrder] = useState('ascending');
    const [showSearch, setShowSearch] = useState(false);
    const [showDesc, setShowDesc] = useState(true);

    const sortHistoryList = () => {

        const getTime = (val) => {
            if (typeof val === "number") return val;
            if (val && typeof val.toDate === "function") return val.toDate().getTime(); // Firestore Timestamp
            if (typeof val === "string") return new Date(val).getTime();
            return 0;
        };

        return serverData.sort((a, b) => {
            const timeA = getTime(a.createdAt);
            const timeB = getTime(b.createdAt);
            return storyOrder === "ascending" ? timeA - timeB : timeB - timeA;
        });
    }

    useEffect(() => {
        if (showSearch) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'visible'
        }
    }, [showSearch]);

    const sortedHistoryList = sortHistoryList();

    return (
        <>
            <article className='historiesGrandCntn'>
                <div className="historyListHeader">
                    <h2>All Episodes</h2>
                    <SearchBtn setShowSearch={setShowSearch} compType={compType}></SearchBtn>
                    <button type="button" className='blackBtn motherBtn'>
                        Sort

                        <div className="childDisplay">
                            <h3>Sort By:</h3>
                            <div onClick={() => { setStoryOrder('ascending') }}>Oldest to Newest {storyOrder === 'ascending' && (<i className="icofont-check-alt"></i>)}</div>
                            <div onClick={() => { setStoryOrder('descending') }}>Newest to Oldest {storyOrder === 'descending' && (<i className="icofont-check-alt"></i>)}</div>
                        </div>
                    </button>
                </div>
                {
                    compType === "story" && showDesc && (
                        <div className="typesDecrGrandCntn">
                            <div className="typesDescriptionCntn">
                                <div className="descriptionCntn">
                                    <p>
                                        <span>
                                        <b className='typeDescritptionTag'>Hi</b>- History,</span>
                                        <span><b className='typeDescritptionTag'>Fo</b>- Folklore,</span><span><b className='typeDescritptionTag'>Fi</b>- Fiction</span>
                                        <span><b className='typeDescritptionTag'>Fo</b>- Folklore,</span><span><b className='typeDescritptionTag'>Cu</b>- Culture,</span>
                                        <span><b className='typeDescritptionTag'>Pe</b>- People/Person,</span><span><b className='typeDescritptionTag'>Ha</b>- Happening,</span>
                                    </p>
                                </div>
                                <button type="button" onClick={() => {setShowDesc(false)}}><i className="icofont-close"></i></button>
                            </div>

                        </div>

                    )
                }
                <div className="historiesCntn">
                    {
                        sortedHistoryList.map((elem) => (
                            <div key={`historyList_${elem?.id}`} className="unitHistoryCntn">
                                <div className="historyHead">
                                    <img src={ImgType} alt="history image" />
                                    <Link href={`${elem?.id.startsWith("s") ? `/${elem?.id}` : `/blogs/${elem?.id}`}`} className="historyheadings">
                                        <h3>{elem?.title}</h3>
                                        {
                                            elem?.subtitle && (
                                                <h4>{elem?.subtitle}</h4>
                                            )
                                        }
                                    </Link>

                                    {
                                        showDesc && (
                                            <div className="genreTypeCntn">
                                                {
                                                    elem?.genres ? (
                                                        elem?.genres?.map((genre, idx) => (
                                                            <b key={`${elem?.id}_${idx}`} className='typeDescritptionTag'>{genre?.slice(0, 2)}</b>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <b className='typeDescritptionTag'>Hi</b>
                                                            <b className='typeDescritptionTag'>Pe</b>
                                                        </>
                                                    )
                                                }
                                            </div>

                                        )
                                    }

                                </div>
                                <p>{elem?.previewText}</p>
                                <div className="historyFooter">
                                    <p>Posted On: <span>{new Intl.DateTimeFormat("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }).format(elem?.createdAt)}</span></p>
                                    <Link href={`${elem?.id.startsWith("s") ? `/${elem?.id}` : `/blogs/${elem?.id}`}`}><i className="icofont-readernaut"></i></Link>
                                </div>
                            </div>

                        ))
                    }

                </div>
            </article>
            {showSearch && <SearchComponent onClose={() => setShowSearch(false)} compType={compType}/>}
        </>
    );
}
