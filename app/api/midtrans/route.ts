import { NextApiRequest, NextApiResponse } from "next";
import Transaction from "@/lib/database/models/transaction.model";
import { plans } from "@/constants";
import { connectToDatabase } from "@/lib/database/mongoose";
import snap from "@/lib/midtrans";
import { handleError } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { planId, buyerId } = req.body;

    const selectedPlan = plans.find((plan) => plan._id === planId);

    if (!selectedPlan) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan ID",
      });
    }

    const orderId = `order-${Date.now()}`;

    const newTransaction = new Transaction({
      orderId,
      amount: selectedPlan.price,
      plan: selectedPlan.name,
      credits: selectedPlan.credits,
      buyer: buyerId,
    });

    try {
      await newTransaction.save();

      const transactionParameters = {
        transaction_details: {
          order_id: orderId,
          gross_amount: selectedPlan.price,
        },
        item_details: [
          {
            id: planId,
            price: selectedPlan.price,
            quantity: 1,
            name: selectedPlan.name,
          },
        ],
        customer_details: {
          user_id: buyerId,
        },
      };

      const transaction = await snap.createTransaction(transactionParameters);

      res.status(200).json({
        status: "success",
        message: "Transaction created",
        data: transaction,
      });
    } catch (error) {
      handleError(error);
    }
  }
}
