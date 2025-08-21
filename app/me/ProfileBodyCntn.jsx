'use client'

import { useState, useEffect } from "react";
import { db } from "../db/FirebaseConfig";
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { SignOutButton, useUser } from '@clerk/nextjs';
import Link from "next/link";
import { getPioneers } from "../dashboard__/utilFunctions";
import { PaystackButton } from "react-paystack";



const ProfileBodyCntn = () => {
    const { user } = useUser();
    const [preview, setPreview] = useState(null);
    const [toExpiry, setToExprire] = useState(null);
    const [monthlyPoints, setMonthlyPoints] = useState(null);
    const [userData, setUserData] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const [winners, setWinners] = useState(null);
    const [isWinner, setIsWinner] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const [updateMsg, setUpdateMsg] = useState("Empty Leaderboard...");

    const pioneers = getPioneers() || [];
    const checkPionner = () => {
        const findPionner = pioneers.findIndex((elem) => elem.id === user?.id);
        if (findPionner >= 0) {
            return true;
        } else {
            return false;
        }
    }
    const isPioneer = checkPionner() || false;


    // const rewardMap = {
    //     1: "☀️",
    //     2: "🌑",
    //     3: "🌒",
    //     4: "☄️",
    //     5: "☄️",
    //     6: "☄️",
    //     7: "☄️",
    //     8: "☄️",
    //     9: "☄️",
    //     10: "☄️",
    // };

    const rewardMap = {
        1: "🥇",
        2: "🥈",
        3: "🥉",
        4: "🎖️",
        5: "🎖️",
        6: "🎖️",
        7: "🎖️",
        8: "🎖️",
        9: "🎖️",
        10: "🎖️",
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

        // Get current month/year in MM-YYYY format
        const currentMonthYear = `${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

        // Safely read premium_month from metadata
        const premiumMonth = user?.publicMetadata?.premium_month;

        // Check if they match
        const isActive = premiumMonth === currentMonthYear;
        setIsActive(isActive);

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

    // useEffect(() => {
    //     const fetchLeaderboardPreview = async () => {
    //         if (!user?.id) return;
    //         const localData = localStorage.getItem('leaderboard');
    //         const parsed = JSON.parse(localData);
    //         if (localData) {
    //             const parsed = JSON.parse(localData);
    //             setPreview(parsed?.data);
    //             // If not expired, use local
    //             if (parsed?.expiryTime && Date.now() < parsed.expiryTime) {
    //                 setToExprire(parsed?.expiryTime);
    //                 setPreview(parsed?.data);
    //                 return;
    //             }
    //         }



    //         const userlistRef = collection(db, 'userlist');
    //         const snap = await getDocs(userlistRef);
    //         const allUsers = [];

    //         snap.forEach((docSnap) => {
    //             if (docSnap.id !== '_meta') {
    //                 const data = docSnap.data();
    //                 if (data.users?.length) {
    //                     allUsers.push(...data.users);
    //                 }
    //             }
    //         });

    //         allUsers.sort((a, b) => b.points - a.points);

    //         const currentIndex = allUsers.findIndex((u) => u.user_id === user.id);
    //         if (currentIndex === -1) return;

    //         const start = Math.max(currentIndex - 5, 0);
    //         const end = Math.min(currentIndex + 6, allUsers.length);

    //         const sliced = allUsers.slice(start, end).map((u, idx) => ({
    //             ...u,
    //             position: start + idx + 1,
    //         }));
    //         const theLeaderBoardArr = currentIndex >= 6 ? [...sliced, { ...allUsers[0], position: 1 }] : [...sliced]

    //         theLeaderBoardArr.sort((a, b) => a.position - b.position);

    //         const finalObject = {
    //             data: theLeaderBoardArr,
    //             expiryTime: Date.now() + 1000 * 60 * 60 * 3, // 3 hours
    //         };

    //         localStorage.setItem('leaderboard', JSON.stringify(finalObject));
    //         console.log("setting expiry from DB", finalObject?.expiryTime);

    //         setToExprire(finalObject?.expiryTime)
    //         setPreview(theLeaderBoardArr);
    //     };

    //     fetchLeaderboardPreview();
    // }, [user?.id]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const localData = localStorage.getItem("leaderboard");
            if (localData) {
                const parsed = JSON.parse(localData);
                if (parsed?.expiryTime && Date.now() < parsed.expiryTime) {
                    setToExprire(parsed?.expiryTime);
                    setPreview(parsed?.top_10);
                    return;
                }
            }

            setUpdateMsg("Loading...");
            // Fallback → API
            try {
                const winnersDocRef = doc(db, "winners", "leaderboard");
                const winnersSnap = await getDoc(winnersDocRef);

                // Check if existing doc is fresh
                if (winnersSnap.exists()) {
                    const data = winnersSnap.data();
                    if (data.expiryTime && Date.now() < data.expiryTime) {
                        localStorage.setItem("leaderboard", JSON.stringify(data));
                        setPreview(data?.top_10);
                        setToExprire(data?.expiryTime)
                        return;
                    }
                }

                // Otherwise → rebuild
                const userlistRef = collection(db, "userlist");
                const snap = await getDocs(userlistRef);
                const allUsers = [];

                snap.forEach((docSnap) => {
                    if (docSnap.id !== "_meta") {
                        const data = docSnap.data();
                        if (data.users?.length) {
                            allUsers.push(...data.users);
                        }
                    }
                });

                // Sort descending by points
                allUsers.sort((a, b) => b.points - a.points);

                // Assign position
                const withPosition = allUsers.map((u, idx) => ({
                    ...u,
                    position: idx + 1,
                }));

                // Top 10
                const top_10 = withPosition.slice(0, 10);

                // Listing thresholds
                const listing = {};
                if (withPosition.length >= 100) listing.top_100 = withPosition[99].points;
                if (withPosition.length >= 1000) listing.top_1000 = withPosition[999].points;
                if (withPosition.length >= 100000) listing.top_100000 = withPosition[99999].points;
                if (withPosition.length >= 1000000) listing.top_1000000 = withPosition[999999].points;

                // Build final object
                const finalObject = {
                    top_10,
                    listing,
                    expiryTime: Date.now() + 1000 * 60 * 60 * 0.1, // 2 hours
                };

                // Save to Firestore
                await setDoc(winnersDocRef, finalObject);
                localStorage.setItem("leaderboard", JSON.stringify(finalObject));
                setPreview(finalObject?.top_10);
                setToExprire(finalObject?.expiryTime)

                // const res = await fetch("/api/leaderboard");
                // const res = await fetch(`/api/leaderboard?ts=${Date.now()}`, { cache: "no-store", });
                // const data = await res.json();
                // if (!data.error) {
                //     localStorage.setItem("leaderboard", JSON.stringify(data));
                //     setPreview(data?.top_10);
                //     setToExprire(data?.expiryTime)
                // } else {
                //     console.error(data.error);
                //     setUpdateMsg(`${data.error}`)
                // }
            } catch (error) {
                console.error(error);
                setUpdateMsg(`${error}`)
            }
        };

        fetchLeaderboard();
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

    console.log(Date.now() < 1755800633118);


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
    const canClaim = withinDateRange && isWinner && hasEnoughPoints;

    //paystack widget configuration
    const config = {
        reference: (new Date()).getTime().toString(),
        email: `${user?.emailAddresses[user?.emailAddresses.length - 1].emailAddress}`,
        amount: (isPioneer ? 500 : 1500) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
        publicKey: 'pk_test_680463a03d8cd455d731195ceb8835ce288d94e9',
    };

    //action for when the paystack widget payment goes through successfully
    const handlePaystackSuccessAction = async (reference) => {
        // Implementation for whatever you want to do with reference and after success call.
        await handleRequestProcessAfterPayment();
    };

    // you can call this function anything
    const handlePaystackCloseAction = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')
    }

    const componentProps = {
        ...config,
        text: 'Get Active',
        onSuccess: (reference) => handlePaystackSuccessAction(reference),
        onClose: handlePaystackCloseAction,
    };


    const handleRequestProcessAfterPayment = async () => {
        // Example: get current month-year
        const now = new Date();
        const monthYear = `${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getFullYear()}`;

        try {
            const res = await fetch("/api/set-premium", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    monthYear,
                }),
            });

            const data = await res.json();
            setIsActive(true);
        } catch (err) {
            console.error(err)
        }

    };

    const isPartOfWinners = preview.findIndex((elem) => elem?.user_id === user?.id);
    const pointfromFirst = parseInt(preview[0].points) - parseInt(monthlyPoints);
    const pointfromTopWinners = parseInt(preview[0].points) - parseInt(monthlyPoints)

    return (
        <div className="profileBodyCntn">
            <div className="theprofileDetail">
                <div className="unitDetl left">
                    <h2>Total Monthly Points</h2>
                    <p>{parseInt(monthlyPoints).toLocaleString() || '0'}</p>
                </div>
                <div className="unitDetl right">
                    <h2>Earned Monthly Prize</h2>
                    <p>{reward || '--'}</p>
                </div>
            </div>
            {
                !isActive && (
                    <div className="getActiveGrandCntn">
                        <div>
                            <h3><i className="icofont-notification"></i> Kwiva is going <span>premium+</span></h3>
                            <h2>You aren&apos;t <span>active</span> yet <i className="icofont-police-badge"></i></h2>
                        </div>
                        <p>Get <b>active</b> with just {!isPioneer ? (<span>₦1,500</span>) : (<><del>₦1,500</del> <span>₦500</span></>)} and earn up to <span>₦2M</span> at the end of the month. Get into the groove and start making your millions with Kwiva. Just click on the button, it&apos;s free for now - we are just running tests.</p>
                        <PaystackButton {...componentProps}></PaystackButton>
                    </div>
                )
            }

            <div className="profileLinksGrandCntn">
                <div className="profileLinksCntn">
                    <Link className="unitProfileDetlLink" href="/me/manage">
                        <i className="icofont-ui-settings"></i>Edit Profile
                    </Link>

                    {canClaim ? (
                        <Link className="unitProfileDetlLink" href="/me/claim">
                            <i className="icofont-wallet"></i>Claim Prize
                        </Link>
                    ) : (
                        <span
                            className="unitProfileDetlLink"
                            style={{ opacity: 0.6, pointerEvents: 'none', cursor: 'not-allowed' }}
                        >
                            <i className="icofont-wallet"></i>Claim Prize
                        </span>
                    )}
                </div>
                <div className="profileClaimInfo">
                    <p> ⚠️ Prizes can only be claimed between <span>25th</span> to <span>30th</span> of every month if you are eligible.</p>
                    <p>To be eligible, you must be in the top 10 of the leaderboard and have atleast <span>1,050</span> total monthly points</p>
                </div>
            </div>

            <div className="lastMonthData">
                {isPartOfWinners >= 0 ? (
                    <p>
                        You are only <b>{pointfromFirst.toLocaleString()} points</b> away from being <b>#1</b> and winning <b>#2M</b>
                    </p>
                ) : (
                    <p>
                        You are only <b>{pointfromTopWinners.toLocaleString()} points</b> away from being top 10 and winning <b>#1M. C&apos;mon, you can do this⚡⚡</b>
                    </p>
                )}
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
                                                    ? <b>{`${rewardMap[`${userObj?.position}`]}`}</b>
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
                <h2>Monthly Leaderboard {isActive ? ((<i className="icofont-police-badge"></i>)) : ""}</h2>
                <p>
                    The board below is a cached (not-recent) preview and will be refreshed in <span>{remainingTime || 'loading...'}</span>
                </p>

                <div className="leaderboardList">

                    {preview?.length > 0 ? preview?.map((userObj, i) => {
                        const isCurrentUser = userObj?.user_id === user?.id;

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
                                        ? <b>{`${rewardMap[`${userObj?.position}`]}`}</b>
                                        : '--'}
                                </span>
                            </div>
                        )



                    }) : (
                        <div className='emptyLaederboard'><h2>{updateMsg}</h2></div>
                    )}
                </div>
            </div>
            <SignOutButton></SignOutButton>
        </div>
    )
}

export default ProfileBodyCntn
