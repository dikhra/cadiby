import { NextApiRequest, NextApiResponse } from "next";
import Transaction from "@/lib/database/models/transaction.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError } from "@/lib/utils";
import { NextResponse } from "next/server";
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false, // Ubah menjadi true saat di production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  const { name, planId, amount, credits, buyerId } = await request.json();

  let parameter = {
    item_details: {
      id: planId,
      price: amount,
      name: name,
      quantity: 1,
      credits: credits,
    },
    transaction_details: {
      gross_amount: amount,
      order_id: planId,
      buyerId: buyerId,
    },
  }

  const token = await snap.createTransactionToken(parameter);
  return NextResponse.json({ token });
}