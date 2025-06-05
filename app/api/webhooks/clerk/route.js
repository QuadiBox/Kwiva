// pages/api/webhook.js

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { addDocument } from '@/app/db/firestoreService';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Helper to update userlist collection with the new user short entry
async function updateUserList(userShortData) {
  const metaRef = doc(db, "userlist", "_meta");
  const metaSnap = await getDoc(metaRef);

  let metaData = metaSnap.exists()
    ? metaSnap.data()
    : {
      lastBatchNumber: 1,
      lastUpdated: Date.now(),
      totalUsers: 0,
      totalBatches: 1,
    };

  let batchNumber = metaData.lastBatchNumber;
  let totalUsers = metaData.totalUsers;

  const currentBatchId = `summary_${batchNumber.toString().padStart(3, "0")}`;
  const currentBatchRef = doc(db, "userlist", currentBatchId);
  const currentBatchSnap = await getDoc(currentBatchRef);

  let usersArray = currentBatchSnap.exists()
    ? currentBatchSnap.data().users
    : [];

  // Create new batch if full
  if (usersArray.length >= 500) {
    batchNumber++;
    usersArray = [];
  }

  usersArray.push(userShortData);

  const newDocId = `summary_${batchNumber.toString().padStart(3, "0")}`;

  // Save updated batch
  await setDoc(doc(db, "userlist", newDocId), {
    batchNumber,
    users: usersArray,
  });

  // Update _meta
  const updatedMeta = {
    lastBatchNumber: batchNumber,
    totalUsers: totalUsers + 1,
    lastUpdated: Date.now(),
    totalBatches: Math.max(metaData.totalBatches || 1, batchNumber),
  };

  await setDoc(metaRef, updatedMeta, { merge: true });

  return newDocId;
}

/**
 * Handles POST requests to the webhook endpoint.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_KEY;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, return an error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Error occurred -- no svix headers' }, { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Error occurred during verification' }, { status: 400 });
  }

  // Extract relevant data from the event
  const eventType = evt.type;
  const eventData = evt.data;

  const toUserlist = {
    points: 0,
    referrals: [],
    fullname: `${eventData?.last_name || ""} ${eventData?.first_name || ""}`,
    user_id: eventData?.id,
  };

  const toUsers = {
    ...eventData,
    points: 0,
    referrer: undefined,
    referrals: [],
    summaryDocId: undefined, // Will be set below
  };

  // Here you can add your logic to save the user data to the database
  // Example: saveUserDataToDatabase(evt.data);
  if (eventType === 'user.created') {
    try {
      // Save to userlist and get the summaryDocId
      const summaryDocId = await updateUserList(toUserlist);

      // Attach summaryDocId to the user's full data
      toUsers.summaryDocId = summaryDocId;

      // Save to users collection using setDoc with eventData.id as the document ID
      const userDocRef = doc(db, "users", eventData.id);
      await setDoc(userDocRef, toUsers);

      return NextResponse.json(
        { message: `User created and saved successfully: ${eventData.first_name}` },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error handling user.created event:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: `Data is available now ${eventData.first_name} ${eventType}` }, { status: 200 });
}

/**
 * Handles GET requests to the webhook endpoint.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(req) {
  return NextResponse.json({ message: 'Method not allowed - This endpoint {webhooks/clerk} is only for POST requests' }, { status: 405 });
}

