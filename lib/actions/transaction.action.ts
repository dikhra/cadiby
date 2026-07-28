// lib/actions/transaction.actions.ts

import { handleError } from "../utils";
import { prisma } from "../database/prisma";
import { updateCredits } from "./user.actions";

export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    const { buyerId, ...rest } = transaction;

    const newTransaction = await prisma.transaction.create({
      data: {
        ...rest,
        buyer: { connect: { id: buyerId } },
      },
    });

    return newTransaction;
  } catch (error) {
    handleError(error);
  }
}

export async function updateTransactionStatus(orderId: string, status: string) {
  try {
    const transaction = await prisma.transaction.update({
      where: { orderId },
      data: { status },
    });

    await updateCredits(transaction.buyerId, transaction.credits ?? 0);
  } catch (error) {
    handleError(error);
  }
}
