import React from 'react'
import ProfileHeaderSect from '../me/ProfileHeaderSect'
import Footer from '../homeComponent/Footer'
import DoughnutCntn from './doughnutCntn'

export const metadata = {
    title: 'Donate To Kwiva',
    description:
        "Kwiva is stuck!, we need your help to keep us going. Kindly drop any token you can spare and we'll appreciate it immensely.",
    openGraph: {
        title: 'Donate To Kwiva',
        description: 'Kwiva is stuck!, we need your help to keep us going. Kindly donate any token you can spare and we\'ll appreciate it immensely. Thanks🙏.',
        url: "https://kwiva.online/donate",
        type: 'website',
        images: [
            {
                url: "https://kwiva.online/donate.png"
            }
        ]
    },
    twitter: {
        title: 'Donate To Kwiva',
        creator: "@QuadVox",
        description:
            'Kwiva is stuck!, we need your help to keep us going. Kindly drop any token you can spare and we\'ll appreciate it immensely. Thanks🙏.',
        card: 'summary_large_image',
        url: "https://kwiva.online/donate",
        images: [
            {
                url: "https://kwiva.online/donate.png"
            }
        ]
    },
    robots: {
        index: true,
        follow: true,
    }
};

const Page = () => {
    return (
        <div className="storyGrandCntn histories">
            <ProfileHeaderSect></ProfileHeaderSect>
            <DoughnutCntn></DoughnutCntn>
            <Footer></Footer>
        </div>
    )
}

export default Page
