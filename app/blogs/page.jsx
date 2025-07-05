import { collection, getDocs } from "firebase/firestore";
import { db } from "../db/FirebaseConfig";
import HomeHeader from "../homeComponent/header";
import ArticleWrapper from "../homeComponent/ArticleList";
import Footer from "../homeComponent/Footer";


export const revalidate = 60 * 60 * 12; // Cache for 12 hours


export async function generateMetadata() {

  return {
    title: 'Blogposts - DIY & How-To',
    description: "Welcome to QuadBox's Kwiva",
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs`,
      title: 'Blogposts - DIYs & How-Tos',
      description: "Our Blog section is your daily dose of DIY brilliance and How-to magics. Discover clever tricks, creative projects, and step-by-step guides that make life a little simpler and a lot more fun. Explore, learn, and create; one post at a time.",
      images: [
        {
          url: "https://kwiva.online/blogs_1.png"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      creator: "@QuadVox",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs`,
      title: 'Blogposts - DIYs & How-Tos',
      description: "Our Blog section is your daily dose of DIY brilliance and 'How to' magic. Discover clever tricks, creative projects, and step-by-step guides that make life a little simpler and a lot more fun. Explore, learn, and creat; one post at a time.",
      images: [
        {
          url: "https://kwiva.online/blogs_1.png"
        }
      ]
    },
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
      <HomeHeader headerTitle={"Blogposts - DIY / How-To"} headerSubTitle={null} headerImgSrc={"/Kwiva1.png"} headerText={"Our Blog section is your daily dose of DIY brilliance and 'How to' magic. Discover clever tricks, creative projects, and step-by-step guides that make life a little simpler and a lot more fun. Explore, learn, and create; one post at a time."} headerImgType={"/blogs_1.png"}></HomeHeader>
      <ArticleWrapper serverData={data} compType={'blog'} ImgType={"/blogs_1.png"}></ArticleWrapper>
      <Footer></Footer>
    </div>
  );
}