import QuizQuestionPage from "./ClientComponent";

export async function generateMetadata() {
    return {
        title: 'Quizzez | Kwiva',
        description: "Get up to 80 points after finishing any quiz. Have a crack at our well curated  quizzez.",
        openGraph: {
            title: 'Quizzez | Kwiva',
            description: 'Get up to 80 points after finishing any quiz. Have a crack at our well curated  quizzez.',
            url: `https://kwiva.online/quizzez`,
            type: 'website',
        },
        twitter: {
            title: 'Quizzez | Kwiva',
            description:
                'Get up to 80 points after finishing any quiz. Have a crack at our well curated  quizzez.',
            card: 'summary_large_image',
        },
    };
}

export default function Page({ params }) {
    const { number } = params;
    return (
        <div className="storyGrandCntn quizzez">
            <QuizQuestionPage number={number}></QuizQuestionPage>
        </div>
    )
}