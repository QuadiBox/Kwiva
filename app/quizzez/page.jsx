import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/FirebaseConfig";
import HomeHeader from "../homeComponent/header";
import ArticleWrapper from "../homeComponent/ArticleList";
import Footer from "../homeComponent/Footer";
import QuizWrapper from "./QuizzezList";

export const revalidate = 60 * 60 * 4; // Cache for 4 hours

export async function generateMetadata() {

    return {
        title: 'Quizzez | Kwiva',
        description: "Get up to 60 points after finishing any quiz. Have a crack at our well curated 20 questions quizzez. They are based off of our interesting Short Histories & Blogs articles.",
    };
}


// Server-rendered component
export default async function Page() {
    const fetchFromFirestore = async () => {
        const storylistRef = collection(db, "quizlist");
        const snapshot = await getDocs(storylistRef);

        let allArticles = [];

        snapshot.forEach(docSnap => {
            if (docSnap.id !== "_meta") {
                const data = docSnap.data();
                if (Array.isArray(data.quizzez)) {
                    allArticles.push(...data.quizzez);
                }
            }
        });

        return allArticles;
    }
    const data = await fetchFromFirestore();

    return (
        <div className="storyGrandCntn quizzez">
            <HomeHeader headerTitle={"Quizzez"} headerSubTitle={null} headerImgSrc={"/Kwiva1.png"} headerText={"Finish a quiz and get upto 60 points. Each quiz contains atleast 20 questions, get 20 points for finishing the quiz and extra 2 points for each question you answer correctly. They are based off of our interesting Short Histories & Blogs articles."} headerImgType={"/quizzez_1.png"}></HomeHeader>
            <QuizWrapper serverData={data}></QuizWrapper>
            <Footer></Footer>
        </div>
    );
}