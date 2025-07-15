import GoogleAd from '@/app/GoogleAd';
import { db } from '@/app/db/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import GSTClientComponent from './GSTClientComponent';

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

export default async function Page({ params }) {

    return (
        <div className="storyGrandCntn quizzez">
            <main className="quizPreviewCntn">
                <h1>General Knowledge Quiz</h1>
                <p>Test you mental strenth on the knowledge of everything. Select how many question you want in the session and select the difficulty (<b>Random</b>: <b>18 seconds per question</b>, <b>Easy</b>: <b>20s</b>/question, <b>Medium</b>: <b>15s</b>/question, <b>Hard</b>: <b>11s</b>/question). Get down to business.</p>
                <GSTClientComponent></GSTClientComponent>
            </main>
        </div>
    );
}
