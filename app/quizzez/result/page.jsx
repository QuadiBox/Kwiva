import QuizResultPage from "./ClientComponent";

export async function generateMetadata() {
    return {
        title: 'Quizzez | Kwiva',
        description: "Get up to 60 points after finishing any quiz. Have a crack at our well curated 20 questions quizzez. They are based off of our interesting Short Histories & Blogs articles.",
        openGraph: {
            title: 'Quizzez | Kwiva',
            description: 'Get up to 80 points after finishing any quiz. Have a crack at our well curated 20 questions quizzez. They are based off of our interesting Short Histories & Blogs articles.',
            url: `https://kwiva.online/quizzez/result`,
            type: 'website',
        },
        twitter: {
            title: 'Quizzez | Kwiva',
            description:
                'Get up to 60 points after finishing any quiz. Have a crack at our well curated 20 questions quizzez. They are based off of our interesting Short Histories & Blogs articles.',
            card: 'summary_large_image',
        },
    };
}

const Page = () => {
    return (
        <div className="storyGrandCntn quizzez">
            <QuizResultPage></QuizResultPage>
        </div>
    )
}

export default Page
