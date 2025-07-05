import Footer from "../homeComponent/Footer";
import { currentUser } from "@clerk/nextjs/server";
import ProfileHeaderSect from "./ProfileHeaderSect";
import Link from "next/link";
import ProfileBodyCntn from "./ProfileBodyCntn";


export const metadata = {
    title: 'ME | Kwiva',
    description:
        "User profile - view, update, edit or delete your details as you wish. Make a withdrawal of your rewards as long as you're qualified. Have fun, live, laugh and learn...",
    openGraph: {
        title: 'ME | Kwiva',
        description: "User profile - view, update, edit or delete your details as you wish. Make a withdrawal of your rewards as long as you're qualified. Have fun, live, laugh and learn...",
        url: "https://kwiva.online/me",
        type: 'website',
        images: [
            {
                url: "https://kwiva.online/kwiva_large.png"
            }
        ]
    },
    twitter: {
        title: 'ME | Kwiva',
        description:
            "User profile - view, update, edit or delete your details as you wish. Make a withdrawal of your rewards as long as you're qualified. Have fun, live, laugh and learn...",
        card: 'summary_large_image',
        url: "https://kwiva.online/me",
        images: [
            {
                url: "https://kwiva.online/kwiva_large.png"
            }
        ]
    },
};


// Server-rendered component
export default async function Page() {
    const user = await currentUser();

    function getTimeGreeting() {
        const currentHour = new Date().getHours();

        if (currentHour < 12) {
            return 'Morning';
        } else if (currentHour < 17) {
            return 'Afternoon';
        } else {
            return 'Evening';
        }
    }
    
    return (
        <div className="storyGrandCntn me">
            <ProfileHeaderSect></ProfileHeaderSect>
            <div className="profiletop">
                <h1>Good {getTimeGreeting()}, {user?.username ? user?.username : user?.firstName || 'John Doe'}</h1>
                <Link href={'/me/manage'}><img src={user?.imageUrl ? user?.imageUrl : "/kwivicon.png"} alt="profile image" /></Link>
            </div>
            <ProfileBodyCntn></ProfileBodyCntn>
            <Footer></Footer>
        </div>
    );
}
