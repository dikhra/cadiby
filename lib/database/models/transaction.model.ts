import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  credits: {
    type: Number,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "pending",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;