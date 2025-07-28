import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/FirebaseConfig";
import HomeHeader from "../homeComponent/header";
import Footer from "../homeComponent/Footer";
import QuizWrapper from "./QuizzezList";
import Link from "next/link";

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
            <div className="specialQuizGrandCntn">
              <h2> <i className="icofont-medal"></i> Are you as smart as you think you are?</h2>
              <p>Interested in more than just story quizzez, test your knowledge with our specials. <b>(I)</b> Choose your discipline, <b>(II)</b> Set how many questions you want, <b>(III)</b> Select the difficulty and get down to business. Godspeed!🚀</p>
              <p></p>

              <div className="disciplineSelector">
                <Link href={"/quizzez/gst"} className="unitDisciplineCntn">
                  <i className="icofont-electron"></i>
                  <div className="disciplinetype">
                    <h3>General Knowledge</h3>
                  </div>
                </Link>
                <Link href={"/quizzez/science"} className="unitDisciplineCntn">
                  <i className="icofont-dna"></i>
                  <div className="disciplinetype">
                    <h3>Science</h3>
                  </div>
                </Link>
                <div  className="unitDisciplineCntn">
                  <i className="icofont-quill-pen"></i>
                  <div className="disciplinetype">
                    <h3>Arts</h3>
                    <p className="commingSoon">Coming soon!</p>
                  </div>
                </div>
                <div className="unitDisciplineCntn">
                  <i className="icofont-university"></i>
                  <div className="disciplinetype">
                    <h3>Commerce</h3>
                    <p className="commingSoon">Coming soon!</p>
                  </div>
                </div>
              </div>
            </div>
            <QuizWrapper serverData={data}></QuizWrapper>
            <Footer></Footer>
        </div>
    );
}