import React from 'react';
import { currentUser } from "@clerk/nextjs/server";
import InviteClientPage from './InviteClientComponent';

export const metadata = {
  title: 'Kwiva | Invite',
  description: "Join our community today to live, laugh, learn & earn.  __QuadBox's Kwiva__",
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    title: 'Kwiva | Invite',
    description: "Join our community today to live, laugh, learn & earn.  __QuadBox's Kwiva__",
    images: [
      {
        url: "https://kwiva.online/kwiva_large.png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    creator: "@QuadVox",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    title: 'Kwiva | Invite',
    description: "Join our community today to live, laugh, learn & earn.  __QuadBox's Kwiva__",
    images: [
      {
        url: "https://kwiva.online/kwiva_large.png"
      }
    ]
  },
}

const Page = async () => {
    const user = await currentUser();
    return (
        <div className="storyGrandCntn invite">
            <h1>Invite Your Friends...</h1>
            <InviteClientPage></InviteClientPage>
        </div>
    )
}

export default Page
