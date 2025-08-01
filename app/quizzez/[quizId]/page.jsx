import GoogleAd from '@/app/GoogleAd';
import { db } from '@/app/db/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Startbutton from './Startbutton';

export const revalidate = 60 * 60 * 24; // 24 hours

export async function generateMetadata({ params }) {
    return {
        title: 'Kwiva | Quizzez',
        description: "Get up to 60 points after finishing any quiz. Have a crack at our well curated 20 questions quizzez. They are based off of our interesting Short Histories & Blogs articles.",
        openGraph: {
            type: "website",
            url: `https://kwiva.online/quizzez/${params.quizId}`,
            title: 'Kwiva | Quizzez',
            description: "Get up to 60 points after finishing any quiz. Have a crack at our well curated 20 questions quizzez. They are based off of our interesting Short Histories & Blogs articles.",
            images: [
                {
                    url: "https://kwiva.online/quizzez_1.png"
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            creator: "@QuadVox",
            url: `https://kwiva.online/quizzez/${params.quizId}`,
            title: 'Kwiva | Quizzez',
            description: "Get up to 60 points after finishing any quiz. Have a crack at our well curated 20 questions quizzez. They are based off of our interesting Short Histories & Blogs articles.",
            images: [
                {
                    url: "https://kwiva.online/quizzez_1.png"
                }
            ]
        },
    };
}

export default async function QuizIntroPage({ params }) {
    const quizSnap = await getDoc(doc(db, 'quizzez', params.quizId));
    if (!quizSnap.exists()) return <div><h1>Quiz not found</h1></div>;

    const quizData = quizSnap.data();
    const { title, description, duration, questions } = quizData;

    const cleanedData = {
        ...quizData,
        createdAt: quizData.createdAt?.toMillis?.() || null, // convert Timestamp to number
    };

    return (
        <div className="storyGrandCntn quizzez">
            <main className="quizPreviewCntn">
                <h1>{title} Quiz</h1>
                <p>{description}</p>
                <p>Duration: <strong>{duration} minute{duration > 1 ? 's' : ''}</strong></p>
                <p>Count: <strong>{questions.length} Questions</strong></p>

                {/* Example ad component */}
                <div className="ad_slot">
                    <GoogleAd key={`ad-qz-${params.quizId}-start`} adKey={`ad-qz-${params.quizId}-start`}></GoogleAd>
                </div>

                <Startbutton dbData={cleanedData} quizId={params.quizId}></Startbutton>
            </main>
        </div>
    );
}
