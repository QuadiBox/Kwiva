// app/[...story_id]/page.jsx

import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../db/FirebaseConfig"; // Adjust to your setup
import { notFound } from "next/navigation";
import StoryContent from "./StoryContent ";
import HomeHeader from "../homeComponent/header";
import Footer from "../homeComponent/Footer";
import Link from "next/link";
// import StoryClientComponent from "../components/StoryClientComponent";

export const revalidate = 60 * 60 * 4; // Cache for 4 hours

// Shared function to fetch story data by contentId
async function getStoryByContentId(contentId) {
    const storiesRef = collection(db, "stories");
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
    const { story_id } = params;
    const story = await getStoryByContentId(story_id[0]);

    if (!story) {
        return {
            title: "Not Found",
            description: "This story does not exist.",
        };
    }

    return {
        title: story.title || "Untitled Story",
        description: "Welcome to QuadBox's Kwiva",
        openGraph: {
            type: "website",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
            title: story.title || "Untitled Story",
            description: story.previewText || "",
            images: [
                {
                    url: "https://kwiva.online/stories_1.png"
                }
            ]
        },
        twitter: {
            card: "summary_image_large",
            creator: "@QuadVox",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
            title: story.title || "Untitled Story",
            description: story.previewText || "",
            images: [
                {
                    url: "https://kwiva.online/stories_1.png"
                }
            ]
        },
    };
}

export default async function Page({ params }) {
    const { story_id } = params;
    const story = await getStoryByContentId(story_id[0]);
    

    if (!story) {
        notFound();
    }

    return (
        <div className="storyGrandCntn histories">
            <HomeHeader headerTitle={story?.title} headerSubTitle={story?.subtitle} headerImgSrc={"/Kwiva1.png"} headerText={story?.previewText} headerImgType={"/stories_1.png"}></HomeHeader>
            <div className="mainContentCntn">
                <StoryContent htmlContent={story?.mainContent?.split('[AD]')}></StoryContent>
                <div className="prevNextCntn">
                    {
                        story?.prevStory.s_id && (
                            <Link href={`/${story?.prevStory.s_id}`} className="unitPrevNext prev">
                                <h4>Prev:</h4>
                                <p>{story?.prevStory.title}</p>
                            </Link>
                        )
                    }
                    {
                        story?.nextStory.s_id && (
                            <Link href={`/${story?.nextStory.s_id}`} className="unitPrevNext next">
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
