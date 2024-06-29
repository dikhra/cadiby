import { NextApiRequest, NextApiResponse } from "next";
import Transaction from "@/lib/database/models/transaction.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { handleError } from "@/lib/utils";
import { NextResponse } from "next/server";
import { createTransaction } from "@/lib/actions/transaction.action";
const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false, // Ubah menjadi true saat di production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  const { name, planId, amount, credits, buyerId } = await request.json();

  const orderId = `${planId}-${Date.now()}`;

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
      order_id: orderId,
      buyerId: buyerId,
    },
  };

  try {
    const token = await snap.createTransactionToken(parameter);

    const transaction = await createTransaction({
      createdAt: new Date(),
      orderId: orderId,
      amount: amount || 0,
      plan: name || "",
      credits: credits || "",
      buyerId: buyerId || "",
      status: "pending",
      updatedAt: new Date(),
    });

    return NextResponse.json({ token });
  } catch (error) {
    handleError(error); // Handle error appropriately
  }
}
