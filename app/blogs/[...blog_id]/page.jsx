// app/[...story_id]/page.jsx

import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/app/db/FirebaseConfig";
import { notFound } from "next/navigation";
import StoryContent from "@/app/[...story_id]/StoryContent ";
import HomeHeader from "@/app/homeComponent/header";
import Footer from "@/app/homeComponent/Footer";
import Link from "next/link";
// import StoryClientComponent from "../components/StoryClientComponent";

export const revalidate = 60 * 60 * 24; // Cache for 24 hours

// Shared function to fetch story data by contentId
async function getStoryByContentId(contentId) {
    const storiesRef = collection(db, "blogs");
    const q = query(storiesRef, where("contentId", "==", contentId), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return null;
    }

    const docSnap = snapshot.docs[0];
    return { docId: docSnap.id, ...docSnap.data() };
}

// Use shared fetch logic in generateMetadata
export async function generateMetadata({ params }) {
    const { blog_id } = params;
    const story = await getStoryByContentId(blog_id[0]);

    if (!story) {
        return {
            title: "Not Found",
            description: "This blog does not exist.",
        };
    }

    return {
        title: story.title || "Untitled Story",
        description: "Welcome to QuadBox's Kwiva",
        openGraph: {
            type: "website",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blog_id}`,
            title: story.title || "Untitled Story",
            description: story.previewText || "",
            images: [
                {
                    url: "https://kwiva.online/blogs_1.png"
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            creator: "@QuadVox",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs/${blog_id}`,
            title: story.title || "Untitled Story",
            description: story.previewText || "",
            images: [
                {
                    url: "https://kwiva.online/blogs_1.png"
                }
            ]
        },
    };
}

export default async function Page({ params }) {
    const { blog_id } = params;
    const story = await getStoryByContentId(blog_id[0]);


    if (!story) {
        notFound();
    }

    return (
        <div className="storyGrandCntn blogs">
            <HomeHeader headerTitle={story?.title} headerSubTitle={story?.subtitle} headerImgSrc={"/Kwiva1.png"} headerText={story?.previewText} headerImgType={"/blogs_1.png"}></HomeHeader>
            <div className="mainContentCntn">
                <StoryContent htmlContent={story?.mainContent?.split('[AD]')}></StoryContent>
                <div className="prevNextCntn">
                    {
                        story?.prevStory.b_id && (
                            <Link href={`/blogs/${story?.prevStory.b_id}`} className="unitPrevNext prev">
                                <h4>Prev:</h4>
                                <p>{story?.prevStory.title}</p>
                            </Link>
                        )
                    }
                    {
                        story?.nextStory.b_id && (
                            <Link href={`/blogs/${story?.nextStory.b_id}`} className="unitPrevNext next">
                                <h4>Next:</h4>
                                <p>{story?.nextStory.title}</p>
                            </Link>
                        )
                    }
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}
