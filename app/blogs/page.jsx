import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/FirebaseConfig";
import HomeHeader from "../homeComponent/header";
import ArticleWrapper from "../homeComponent/ArticleList";
import Footer from "../homeComponent/Footer";

export const revalidate = 60 * 60 * 4; // Cache for 4 hours

export async function generateMetadata() {

  return {
    title: 'Blogposts - DIY / How-To',
    description: "Our Blog section is your daily dose of DIY brilliance and 'How to' magic. Discover clever tricks, creative projects, and step-by-step guides that make life a little simpler and a lot more fun. Explore, learn, and create—one post at a time.",
  };
}


// Server-rendered component
export default async function Page() {
  const fetchFromFirestore = async () => {
    const storylistRef = collection(db, "bloglist");
    const snapshot = await getDocs(storylistRef);

    let allArticles = [];

    snapshot.forEach(docSnap => {
      if (docSnap.id !== "_meta") {
        const data = docSnap.data();
        if (Array.isArray(data.articles)) {
          allArticles.push(...data.articles);
        }
      }
    });

    return allArticles;
  }
  const data = await fetchFromFirestore();
  return (
    <div className="storyGrandCntn blogs">
      <HomeHeader headerTitle={"Blogposts - DIY / How-To"} headerSubTitle={null} headerImgSrc={"/Kwiva1.png"} headerText={"Our Blog section is your daily dose of DIY brilliance and 'How to' magic. Discover clever tricks, creative projects, and step-by-step guides that make life a little simpler and a lot more fun. Explore, learn, and create—one post at a time."} headerImgType={"/blogs_1.png"}></HomeHeader>
      <ArticleWrapper serverData={data}></ArticleWrapper>
      <Footer></Footer>
    </div>
  );
}