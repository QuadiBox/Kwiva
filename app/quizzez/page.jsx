import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/FirebaseConfig";
import HomeHeader from "../homeComponent/header";
import Footer from "../homeComponent/Footer";
import QuizWrapper from "./QuizzezList";

export const revalidate = 60 * 60 * 24; // Cache for 24 hours

export const metadata = {
  title: 'Kwiva | Quizzez',
  description: "Get up to 60 points after finishing any quiz. Have a crack at our well curated 20 questions quizzez. They are based off of our interesting Short Histories & Blogs articles.",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/quizzez`,
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
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/quizzez`,
    title: 'Kwiva | Quizzez',
    description: "Get up to 60 points after finishing any quiz. Have a crack at our well curated 20 questions quizzez. They are based off of our interesting Short Histories & Blogs articles.",
    images: [
      {
        url: "https://kwiva.online/quizzez_1.png"
      }
    ]
  },
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