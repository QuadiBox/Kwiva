import React from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/db/FirebaseConfig";
import Link from 'next/link';

const Page = async () => {
    const fetchArticleSummaries = async () => {
        const snapshot = await getDocs(collection(db, "bloglist"));
        let allSummaries = [];

        snapshot.forEach(doc => {
            if (doc.id !== "_meta") {
                const data = doc.data();
                allSummaries.push(...data.articles);
            }
        });

        return allSummaries;
    };

    const sortArticles = async (order = "descending") => {
        const summaries = await fetchArticleSummaries();


        const getTime = (val) => {
            if (typeof val === "number") return val;
            if (val && typeof val.toDate === "function") return val.toDate().getTime(); // Firestore Timestamp
            if (typeof val === "string") return new Date(val).getTime();
            return 0;
        };

        return summaries.sort((a, b) => {
            const timeA = getTime(a.createdAt);
            const timeB = getTime(b.createdAt);
            return order === "ascending" ? timeA - timeB : timeB - timeA;
        });
    };

    const sortedArticles = await sortArticles("descending");


    return (
        <div className='dashmainCntn blogs'>
            <h1 className="textEditorHeader">All Blogposts</h1>
            <div className="newArticleLinkCntn">
                <Link href={"/dashboard__/new_blog"}>Add a New Blogpost <i className="icofont-plus"></i></Link>
            </div>
            <div className="storiesCntn">
                {
                    sortedArticles.length > 0 ? (
                        sortedArticles.map((elem, idx) => (
                            <div key={`unitstory_${elem?.id}`} className="unitStory">
                                <div className="unitStoryHeader">
                                    <img src={elem?.summaryImage ? elem?.summaryImage : "/kwivicon.png"} alt="story image" />
                                    <h2>{elem?.title}: {elem?.subtitle}</h2>
                                </div>
                                <p>{elem?.previewText}</p>
                                <div className="unitStoryFooter">
                                    <p>Posted on: {new Intl.DateTimeFormat("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }).format(elem?.createdAt)}
                                    </p>
                                    <Link href={`/dashboard__/edit_blog/${elem?.id}`} className='unitStoryOptionsBtn mobile' type="button">
                                        Edit
                                    </Link>
                                    <button className='unitStoryOptionsBtn desktop' type="button">
                                        <i className="icofont-settings"></i>

                                        <Link href={`/dashboard__/edit_blog/${elem?.id}`}>Edit</Link>
                                    </button>
                                </div>
                            </div>

                        ))
                    ) : (
                        <h1>You currently have no Blogpost posted!!!</h1>
                    )
                }

            </div>
        </div>
    )
}

export default Page
