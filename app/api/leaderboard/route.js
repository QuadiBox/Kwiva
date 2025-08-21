import { NextResponse } from "next/server";
import { db } from "@/app/db/FirebaseConfig";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

export async function GET() {
    try {
        const winnersDocRef = doc(db, "winners", "leaderboard");
        const winnersSnap = await getDoc(winnersDocRef);

        // Check if existing doc is fresh
        if (winnersSnap.exists()) {
            const data = winnersSnap.data();
            if (data.expiryTime && Date.now() < data.expiryTime) {
                return NextResponse.json(data); // ✅ return cached leaderboard
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
            expiryTime: Date.now() + 1000 * 60 * 60 * 2, // 2 hours
        };

        // Save to Firestore
        await setDoc(winnersDocRef, finalObject);

        return NextResponse.json(finalObject);

    } catch (err) {
        console.error("Leaderboard rebuild failed:", err);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
