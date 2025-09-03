import React from 'react'
import ProfileHeaderSect from '../me/ProfileHeaderSect'
import Footer from '../homeComponent/Footer'
import DoughnutCntn from './doughnutCntn'

export async function generateMetadata() {

    return {
        title: 'Donate To Kwiva',
        description: "Kwiva is stuck!, we need your help to keep us going. Kindly drop any token you can spare and we'll appreciate it immensely.",
        openGraph: {
            type: "website",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/donate`,
            title: 'Donate To Kwiva',
            description: "Kwiva is stuck!, we need your help to keep us going. Kindly drop any token you can spare and we'll appreciate it immensely. Thanks🙏.",
            images: [
                {
                    url: "https://kwiva.online/donate.png"
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            creator: "@QuadVox",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/donate`,
            title: 'Donate To Kwiva',
            description: "Kwiva is stuck!, we need your help to keep us going. Kindly drop any token you can spare and we'll appreciate it immensely. Thanks🙏.",
            images: [
                {
                    url: "https://kwiva.online/donate.png"
                }
            ]
        },
    };
}

const Page = () => {
    return (
        <div className="storyGrandCntn me">
            <ProfileHeaderSect></ProfileHeaderSect>
            <DoughnutCntn></DoughnutCntn>
            <Footer></Footer>
        </div>
    )
}

export default Page
