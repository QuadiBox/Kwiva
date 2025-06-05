// pages/api/webhooks/paystack

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Handles POST requests to the webhook endpoint.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    throw new Error('Please add your secret key from Paystack Dashboard to .env or .env.local');
  }

  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');


  // Validate the Paystack signature
  if (hash !== req.headers['x-paystack-signature']) {
    return NextResponse.json({ error: 'Error occurred -- Invalid signature' }, { status: 400 });
  }

  // The request is verified, handle the event
  const data = req.body;

  const eventType = data.event;
  const eventData = data.data;


  return NextResponse.json({ message: `Data is available now` }, { status: 200 });
}

/**
 * Handles GET requests to the webhook endpoint.
 * 
 * @param {Request} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object.
 */
export async function GET(req) {
  return NextResponse.json({ message: 'Method not allowed - This endpoint {webhooks/paystack} is only for POST requests' }, { status: 405 });
}
