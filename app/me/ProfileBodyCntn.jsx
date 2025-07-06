'use client'

import { useState, useEffect } from "react";
import { db } from "../db/FirebaseConfig";
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { SignOutButton, useUser } from '@clerk/nextjs';
import Link from "next/link";



const ProfileBodyCntn = () => {
    const { user } = useUser();
    const [preview, setPreview] = useState(null);
    const [toExpiry, setToExprire] = useState(null);
    const [monthlyPoints, setMonthlyPoints] = useState(null);
    const [userData, setUserData] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const [winners, setWinners] = useState(null);
    const [isWinner, setIsWinner] = useState(false);

    // const user = {
    //     id: "user_1427882663"
    // }


    const rewardMap = {
        1: 1500000,
        2: 700000,
        3: 500000,
        4: 100000,
        5: 100000,
        6: 100000,
        7: 100000,
        8: 100000,
        9: 100000,
        10: 100000,
    };

    // 🧠 Utility: Get reward from leaderboard
    const getRewardForUser = (previewList, userId) => {

        const entry = previewList?.find((u) => u.user_id === userId);
        return entry ? rewardMap[entry.position] || 0 : 0;
    };

    function formatTime(ms) {
        const totalSeconds = Math.max(Math.floor(ms / 1000), 0);
        const hours = Math.floor(totalSeconds / 3600)
            .toString()
            .padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}h : ${minutes}m : ${seconds}s`;
    }


    // ✅ Fetch live monthly winners every reload
    useEffect(() => {
        if (!user) return;
        const today = new Date();
        const day = today.getDate();

        if (day >= 25 && day <= 30) {
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const docId = `${month}-${year}`;
            const ref = doc(db, 'winners', docId);

            getDoc(ref)
                .then((snap) => {
                    if (snap.exists()) {
                        setWinners(snap.data());
                        const winners = snap.data()?.winners || [];
                        const winnerEntry = winners.find(w => w.user_id === user.id);

                        if (winnerEntry && parseInt(winnerEntry?.points) > 1050) {
                            setIsWinner(true);
                        }
                    } else {
                        setWinners(null);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching winners:', error);
                    setWinners(null);
                });
        }
    }, [user]);

    // ✅ Fetch live monthly points every reload
    useEffect(() => {
        const fetchMonthlyPoints = async () => {
            if (!user?.id) return;

            const localKey = `user_${user.id}`;
            let localUser = null;

            try {
                localUser = JSON.parse(localStorage.getItem(localKey) || '{}');
            } catch (err) {
                localUser = null;
            }

            let summaryDocId = localUser?.summaryDocId;

            // Fallback to fetch from users collection
            if (!summaryDocId) {
                const userRef = doc(db, 'users', user.id);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) return;
                const userData = userSnap.data();
                summaryDocId = userData.summaryDocId;
                localStorage.setItem(localKey, JSON.stringify(userData));
            }

            if (summaryDocId) {
                const summaryRef = doc(db, 'userlist', summaryDocId);
                const summarySnap = await getDoc(summaryRef);
                if (summarySnap.exists()) {
                    const data = summarySnap.data();
                    const userObj = data.users.find((u) => u.user_id === user.id);
                    setMonthlyPoints(userObj?.points || 0);
                    setUserData(userObj);
                }
            }
        };

        fetchMonthlyPoints();
    }, [user?.id]);

    useEffect(() => {
        const fetchLeaderboardPreview = async () => {
            if (!user?.id) return;
            const localData = localStorage.getItem('leaderboard');
            const parsed = JSON.parse(localData);
            if (localData) {
                const parsed = JSON.parse(localData);

                // If not expired, use local
                if (parsed?.expiryTime && Date.now() < parsed.expiryTime) {
                    setToExprire(parsed?.expiryTime);
                    setPreview(parsed?.data);
                    return;
                }
            }



            const userlistRef = collection(db, 'userlist');
            const snap = await getDocs(userlistRef);
            const allUsers = [];

            snap.forEach((docSnap) => {
                if (docSnap.id !== '_meta') {
                    const data = docSnap.data();
                    if (data.users?.length) {
                        allUsers.push(...data.users);
                    }
                }
            });

            allUsers.sort((a, b) => b.points - a.points);

            const currentIndex = allUsers.findIndex((u) => u.user_id === user.id);
            if (currentIndex === -1) return;

            const start = Math.max(currentIndex - 5, 0);
            const end = Math.min(currentIndex + 6, allUsers.length);

            const sliced = allUsers.slice(start, end).map((u, idx) => ({
                ...u,
                position: start + idx + 1,
            }));

            const theLeaderBoardArr = currentIndex >= 6 ? [...sliced, { ...allUsers[0], position: 1 }] : [...sliced]

            theLeaderBoardArr.sort((a, b) => a.position - b.position);

            const finalObject = {
                data: theLeaderBoardArr,
                expiryTime: Date.now() + 1000 * 60 * 60 * 3, // 3 hours
            };

            localStorage.setItem('leaderboard', JSON.stringify(finalObject));
            console.log("setting expiry from DB", finalObject?.expiryTime);

            setToExprire(finalObject?.expiryTime)
            setPreview(sliced);
        };

        fetchLeaderboardPreview();
    }, [user?.id]);

    useEffect(() => {
        if (!preview && !toExpiry) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = toExpiry - now;
            // const diff = 1751088691636 - now;
            setRemainingTime(formatTime(diff));
        }, 1000);

        return () => clearInterval(interval);
    }, [preview]);


    // if (!preview || monthlyPoints === null) return <p>Loading...</p>;

    const reward = getRewardForUser(preview, user?.id);

    function formatNumber(vlad) {
        if (vlad) {
            let value = parseInt(vlad)
            if (value < 1000) {
                return value?.toString();
            } else if (value < 1_000_000) {
                return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k';
            } else {
                return (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1) + 'M';
            }
        } else {
            return 0;
        }
    }

    const today = new Date();
    const date = today.getDate();
    const withinDateRange = date >= 25 && date <= 30;
    const hasEnoughPoints = monthlyPoints >= 1050;
    const hasReward = reward > 0;
    const canWithdraw = withinDateRange && isWinner;

    return (
        <div className="profileBodyCntn">
            <div className="theprofileDetail">
                <div className="unitDetl left">
                    <h2>Total Monthly Points</h2>
                    <p>{formatNumber(monthlyPoints) || '0'}</p>
                </div>
                <div className="unitDetl right">
                    <h2>Earned Monthly Reward</h2>
                    <p>₦{reward.toLocaleString() || '0'}</p>
                </div>
            </div>
            <div className="profileLinksGrandCntn">
                <div className="profileLinksCntn">
                    <Link className="unitProfileDetlLink" href="/me/manage">
                        <i className="icofont-ui-settings"></i>Edit Profile
                    </Link>

                    {canWithdraw ? (
                        <Link className="unitProfileDetlLink" href="/me/withdraw">
                            <i className="icofont-wallet"></i>Withdraw Reward
                        </Link>
                    ) : (
                        <span
                            className="unitProfileDetlLink"
                            style={{ opacity: 0.6, pointerEvents: 'none', cursor: 'not-allowed' }}
                        >
                            <i className="icofont-wallet"></i>Withdraw Reward
                        </span>
                    )}
                </div>
                <div className="profileWithdrawalInfo">
                    <p> ⚠️ Withdrawals can only be made between <span>25th</span> to <span>30th</span> of every month if you are eligible.</p>
                    <p>To be eligible, you must be in the top 10 of the leaderboard and have atleast <span>1,050</span> total monthly points</p>
                </div>
            </div>

            <div className="lastMonthData">
                {userData?.last_month_position != null ? (
                    <p>
                        {withinDateRange ? "This" : "Last"} month, you came <b>
                            {userData.last_month_position.toLocaleString()}
                            {(() => {
                                const pos = userData.last_month_position;
                                const j = pos % 10,
                                    k = pos % 100;
                                if (j === 1 && k !== 11) return 'st';
                                if (j === 2 && k !== 12) return 'nd';
                                if (j === 3 && k !== 13) return 'rd';
                                return 'th';
                            })()}
                        </b> with a total point of <b>{userData.last_month_points.toLocaleString()}</b>pts.
                    </p>
                ) : (
                    <p>
                        Looks like it is your first month here. Rack up points to earn exciting rewards at the end of the month. <b>Godspeed!🚀</b>
                    </p>
                )}
            </div>


            {
                winners && (
                    <div className="monthlyLeaderboardContainer">
                        <h2>This Month Winners (Top 10 🎯)</h2>
                        <div className="leaderboardList">
                            {winners?.winners && (
                                winners?.winners.map((userObj, i) => {
                                    const isCurrentUser = userObj?.user_id === user.id;

                                    return (
                                        <div
                                            key={userObj?.user_id}
                                            className={`leaderboardItem ${isCurrentUser ? ' currentUser' : ''}`}
                                        >
                                            <span className="position">#{(userObj?.position).toLocaleString()}</span>
                                            <span className="fullname">
                                                {
                                                    userObj?.points > 1050 ? (
                                                        <i id="qualified" className="icofont-check-circled"></i>
                                                    ) : (
                                                        <i id="errorMsg" className="icofont-close-circled"></i>
                                                    )
                                                }
                                                {isCurrentUser ? 'YOU' : `${userObj?.fullname ? userObj?.fullname : 'John Doe'}`}
                                            </span>
                                            <span className="points"><b>{formatNumber(userObj?.points)}</b> pts</span>
                                            <span className="reward">
                                                {rewardMap[`${userObj?.position}`]
                                                    ? <b>{`₦${formatNumber(rewardMap[`${userObj?.position}`])}`}</b>
                                                    : '--'}
                                            </span>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                )
            }
            <div className="monthlyLeaderboardContainer">
                <h2>Monthly Leaderboard</h2>
                <p>
                    The board below is a cached (not-recent) preview and will be refreshed in <span>{remainingTime || 'loading...'}</span>
                </p>

                <div className="leaderboardList">

                    {preview?.length > 0 ? preview?.map((userObj, i) => {
                        const isCurrentUser = userObj?.user_id === user?.id;

                        if (i === 0 && preview[i + 1]?.position > 3) {
                            return (
                                <>
                                    <div
                                        key={userObj?.user_id}
                                        className={`leaderboardItem ${isCurrentUser ? ' currentUser' : ''}`}
                                    >
                                        <span className="position">#{(userObj?.position).toLocaleString()}</span>
                                        <span className="fullname">
                                            {isCurrentUser ? 'YOU' : `${userObj?.fullname ? userObj?.fullname : 'John Doe'}`}
                                        </span>
                                        <span className="points">{formatNumber(userObj?.points)} pts</span>
                                        <span className="reward">
                                            {rewardMap[`${userObj?.position}`]
                                                ? <b>{`₦${formatNumber(rewardMap[`${userObj?.position}`])}`}</b>
                                                : '--'}
                                        </span>
                                    </div>
                                    <div className="spaceLeaderboard">
                                        <h2>...</h2>
                                    </div>
                                </>
                            )
                        } else {
                            return (
                                <div
                                    key={userObj?.user_id}
                                    className={`leaderboardItem ${isCurrentUser ? ' currentUser' : ''}`}
                                >
                                    <span className="position">#{(userObj?.position).toLocaleString()}</span>
                                    <span className="fullname">
                                        {isCurrentUser ? 'YOU' : `${userObj?.fullname ? userObj?.fullname : 'John Doe'}`}
                                    </span>
                                    <span className="points"><b>{formatNumber(userObj?.points)}</b> pts</span>
                                    <span className="reward">
                                        {rewardMap[`${userObj?.position}`]
                                            ? <b>{`₦${formatNumber(rewardMap[`${userObj?.position}`])}`}</b>
                                            : '--'}
                                    </span>
                                </div>
                            )
                        }
                    }) : (
                        <div className='emptyLaederboard'><h2>Empty Leaderboard...</h2></div>
                    )}
                </div>
            </div>
            <SignOutButton></SignOutButton>
        </div>
    )
}

export default ProfileBodyCntn
