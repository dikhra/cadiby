// lib/actions/transaction.actions.ts

import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database/mongoose";
import Transaction from "../database/models/transaction.model";
import { updateCredits } from "./user.actions";

export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();

    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}

export async function updateTransactionStatus(orderId: string, status: string) {
  try {
    await connectToDatabase();

    // Update the transaction status
    await Transaction.updateOne(
      { orderId },
      { status: status, updatedAt: new Date() }
    );

    const transaction = await Transaction.findOne({ orderId: orderId });

    await updateCredits(transaction.buyer, transaction.credits);
  } catch (error) {
    handleError(error);
  }
}
