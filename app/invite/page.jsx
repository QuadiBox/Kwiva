import React from 'react';
import { currentUser } from "@clerk/nextjs/server";
import InviteClientPage from './InviteClientComponent';

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
