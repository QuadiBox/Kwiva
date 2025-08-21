import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const { userId, monthYear } = await req.json();

        if (!userId || !monthYear) {
            return NextResponse.json(
                { error: "Missing userId or monthYear in body" },
                { status: 400 }
            );
        }

        // Update the user's public metadata
        await clerkClient.users.updateUser(userId, {
            publicMetadata: {
                premium_month: monthYear,
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update metadata" }, { status: 500 });
    }
}

export async function GET(req) {
  return NextResponse.json({ message: 'Method not allowed - This endpoint {set-premium} is only for POST requests' }, { status: 405 });
}
