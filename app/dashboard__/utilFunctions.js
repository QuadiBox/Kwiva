import { collection, doc, getDoc, getDocs, writeBatch, increment } from 'firebase/firestore';
import { db } from '../db/FirebaseConfig';

export async function archiveMonthlyLeaderboard() {
    try {
        const summaryCollectionRef = collection(db, 'userlist');
        const snapshot = await getDocs(summaryCollectionRef);

        const allUsers = [];
        const summaryDocs = [];

        snapshot.forEach((docSnap) => {
            if (docSnap.id !== '_meta') {
                const data = docSnap.data();
                const users = data.users || [];
                summaryDocs.push({ id: docSnap.id, users });
                allUsers.push(...users);
            }
        });
        
        
        allUsers.sort((a, b) => b.points - a.points);

        const top10 = allUsers.slice(0, 10).map((user, index) => ({
            ...user,
            position: index + 1,
            paid: false,
        }));;
        const now = new Date();
        const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

        const winnersRef = doc(db, 'winners', monthYear);
        const winnersData = {
            createdAt: now,
            winners: top10,
        };


        const updatedDocs = summaryDocs.map(({ id, users }) => {
            const updatedUsers = users.map((u) => {
                const index = allUsers.findIndex((a) => a.user_id === u.user_id);
                const currentPoints = allUsers[index]?.points || 0;
                return {
                    ...u,
                    last_month_points: currentPoints,
                    last_month_position: index + 1,
                    points: 0,
                };
            });
            return { id, users: updatedUsers };
        });

        const batchLimit = 500;
        for (let i = 0; i < updatedDocs.length; i += batchLimit) {
            const batch = writeBatch(db);
            const chunk = updatedDocs.slice(i, i + batchLimit);

            chunk.forEach(({ id, users }) => {
                const ref = doc(db, 'userlist', id);
                batch.update(ref, { users });
            });

            // Add winner archive in the first batch only
            if (i === 0) {
                batch.set(winnersRef, winnersData);
            }

            await batch.commit();
        }


        return {
            success: true,
            message: 'Leaderboard and winners archive completed successfully.',
            updatedDocs: updatedDocs.length,
            top10SavedAs: monthYear,
        };
    } catch (error) {
        console.error('Monthly leaderboard archival failed:', error);
        return {
            success: false,
            message: 'Something went wrong during leaderboard archival.',
            error: error.message,
        };
    }
}
