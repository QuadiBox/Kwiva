'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { db } from '../db/FirebaseConfig';
import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
} from 'firebase/firestore';

export default function InviteClientPage() {
    const { user, isLoaded } = useUser();
    const searchParams = useSearchParams();
    const [inviterName, setInviterName] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const [referralLink, setReferralLink] = useState('');
    const [currentUserObj, setCurrentUserObj] = useState({});


    useEffect(() => {
        if (!isLoaded || !user) return;

        const currentUserId = user?.id;
        const localKey = `user_${currentUserId}`;

        const handleReferral = async () => {
            const refParam = searchParams.get('ref'); // ref=userId%first%last
            const [referrerId, refFirst, refLast] = refParam ? refParam.split(' ') : [];

            // Fetch local user data or fallback to Firestore
            let localUserData = {};
            const currentSnap = await getDoc(doc(db, 'users', user.id));
            localUserData = currentSnap.data();
            localStorage.setItem(localKey, JSON.stringify(localUserData));
            setCurrentUserObj(localUserData);

            const referrerAlreadySet = localUserData?.referrer;

            if (referrerId && refFirst && refLast) {
                // Show who invited you
                setInviterName(`${refFirst} ${refLast}`);
            }


            if (!referrerAlreadySet && referrerId && refFirst && refLast && referrerId !== currentUserId) {

                const referrerRef = doc(db, "users", referrerId);
                const referrerSnap = await getDoc(referrerRef);
                

                if (referrerSnap.exists()) {
                    const referrerData = referrerSnap.data();
                    const summaryDocId = referrerData.summaryDocId;
                    const updatedPoints = (referrerData.points || 0) + 15;

                    // 1. Update referrer’s user doc
                    await updateDoc(referrerRef, {
                        points: updatedPoints,
                        referrals: arrayUnion(user.id),
                    });

                    // 2. Update referrer in userlist summary doc
                    const summaryRef = doc(db, "userlist", summaryDocId);
                    const summarySnap = await getDoc(summaryRef);
                    

                    if (summarySnap.exists()) {
                        const summaryData = summarySnap.data();
                        const updatedUsers = (summaryData.users || []).map((u) => {
                            if (u.user_id === referrerId) {
                                return {
                                    ...u,
                                    points: (u.points || 0) + 15,
                                    referrals: [...(u.referrals || []), user.id],
                                };
                            }
                            return u;
                        });
                        

                        await updateDoc(summaryRef, {
                            users: updatedUsers,
                        });
                    }



                    // 3. Update current user’s referrer field
                    const newUserRef = doc(db, "users", user.id);
                    await updateDoc(newUserRef, {
                        referrer: referrerId,
                    });

                    // 4. Update localStorage
                    const updatedLocal = {
                        ...localUserData,
                        referrer: referrerId,
                    };
                    localStorage.setItem(localKey, JSON.stringify(updatedLocal));
                }
            }
        };

        handleReferral();
    }, [isLoaded, user, searchParams]);

    useEffect(() => {
        if (!isLoaded || !user) return;

        const fullName = `${user.firstName || ''}+${user.lastName || ''}`;
        const baseUrl =
            typeof window !== 'undefined'
                ? window.location.origin
                : process.env.NEXT_PUBLIC_BASE_URL;
        const link = `${baseUrl}/invite?ref=${user.id}+${fullName}`;
        setReferralLink(link);
    }, [isLoaded, user]);

    const handleCopy = async () => {
        try {
            // Try using Clipboard API
            await navigator.clipboard.writeText(referralLink);
            setCopySuccess('Copied!');
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = referralLink;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                document.execCommand('copy');
                setCopySuccess('Copied!');
            } catch {
                setCopySuccess('Copy failed');
            }
            document.body.removeChild(textarea);
        }

        setTimeout(() => setCopySuccess(''), 1500);
    };

    function formatNumber(value) {
        if (value < 1000) {
            return value.toString();
        } else if (value < 1_000_000) {
            return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k';
        } else {
            return (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1) + 'M';
        }
    }


    return (
        <div className="invitePageCntn">
            {inviterName && (
                <p className="invitationCardNote">
                    <i className="icofont-info-square"></i> You were invited by <span className="font-semibold">{inviterName ? inviterName.replace("%27", "'") : "John Doe"}</span>
                </p>
            )}

            <h2 className="text-xl font-bold mb-2">Your Invite Link: <span>Invite your friends & family, earn</span> <b>15 points</b> <span> when they register.</span></h2>
            <div className="inviteLinkCntn">
                <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="border px-3 py-2 rounded w-full"
                />
                <button
                    onClick={handleCopy}
                    className="copyBtn"
                >
                    Copy <i className="icofont-ui-copy"></i>
                    {copySuccess && <span className="text-green-600">{copySuccess}</span>}
                </button>
            </div>

            <div className="invitationDetails">
                <div className="gbesi">
                    <h4>Total Referrals</h4>
                    <p>{currentUserObj?.referrals?.length || 0}</p>
                </div>
                <div className="gbesi">
                    <h4>Total Referral Points</h4>
                    <p>{formatNumber((currentUserObj?.referrals?.length || 0) * 15)}</p>
                </div>
            </div>
        </div>
    );
}
