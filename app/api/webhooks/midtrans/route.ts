import { updateTransactionStatus } from "@/lib/actions/transaction.action";
import Transaction from "@/lib/database/models/transaction.model";
import { handleError } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = await request.json();

  const orderId = response.order_id;
  const transactionStatus = response.transaction_status;
  const fraudStatus = response.fraud_status;

  if (
    transactionStatus === "accept" ||
    (transactionStatus === "settlement" && fraudStatus === "accept")
  ) {
    try {
      const transaction = {
        status: transactionStatus,
      };

      const updatedTransaction = await updateTransactionStatus(
        orderId,
        transaction.status
      );

      return NextResponse.json({
        message: "Transaction success",
        transaction: updatedTransaction,
      });
    } catch (error) {
      handleError(error);
    }
  } else {
    return NextResponse.json({ message: "Transaction failed" });
  }
}
