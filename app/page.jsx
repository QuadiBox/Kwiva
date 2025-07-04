import { collection, getDocs } from "firebase/firestore";
import { db } from "./db/FirebaseConfig"; // Adjust the import to your actual Firebase setup
import HomeHeader from "./homeComponent/header";
import ArticleWrapper from "./homeComponent/ArticleList";
import Footer from "./homeComponent/Footer";

export const revalidate = 60 * 60 * 12; // Cache for 12 hours

export async function generateMetadata() {

  return {
    title: 'Kwiva | Short Histories...',
    description: "Welcome to QuadBox's Kwiva",
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      title: 'Kwiva | Short Histories...',
      description: "History is littered with the extraordinary; moments that shook empires, lives that defied expectations, and events that continue to echo through time. On this page, you'll find our growing collection of captivating historical stories, each one broken into rich, episodic narratives that bring the past vividly to life. We publish new stories every day, and when a new historical tale is released, all its episodes are posted at once.",
      images: [
        {
          url: "https://kwiva.online/stories_1.png"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      creator: "@QuadVox",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      title: 'Kwiva | Short Histories...',
      description: "History is littered with the extraordinary; moments that shook empires, lives that defied expectations, and events that continue to echo through time. On this page, you'll find our growing collection of captivating historical stories, each one broken into rich, episodic narratives that bring the past vividly to life. We publish new stories every day, and when a new historical tale is released, all its episodes are posted at once.",
      images: [
        {
          url: "https://kwiva.online/stories_1.png"
        }
      ]
    },
  };
}


// Server-rendered component
export default async function Page() {
  const fetchFromFirestore = async () => {
    const storylistRef = collection(db, "storylist");
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
    <div className="storyGrandCntn histories">
      <HomeHeader headerTitle={"Short Histories..."} headerSubTitle={null} headerImgSrc={"/Kwiva1.png"} headerText={"History is littered with the extraordinary; moments that shook empires, lives that defied expectations, and events that continue to echo through time. On this page, you'll find our growing collection of captivating historical stories, each one broken into rich, episodic narratives that bring the past vividly to life. We publish new stories every day, and when a new historical tale is released, all its episodes are posted at once."} headerImgType={"/stories_1.png"}></HomeHeader>
      <ArticleWrapper serverData={data} compType={'story'} ImgType={"/stories_1.png"}></ArticleWrapper>
      <Footer></Footer>

    </div>
  );
}
