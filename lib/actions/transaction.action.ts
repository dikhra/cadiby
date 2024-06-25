// lib/actions/transaction.actions.ts

import { redirect } from 'next/navigation';
import { handleError } from '../utils';
import { connectToDatabase } from '../database/mongoose';
import Transaction from '../database/models/transaction.model';
import { updateCredits } from './user.actions';

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
    const data = {
        name: transaction.plan,
        price: transaction.amount,
        credits: transaction.credits
    }

    const response = await fetch('api/midtrans', {
        method: "POST",
        body: JSON.stringify(data)
    })

    const requestData = await response.json()
    console.log({requestData});
    
}

export async function createTransaction(transaction: CreateTransactionParams) {
    try {
      await connectToDatabase();
  
      // Create a new transaction with a buyerId
      const newTransaction = await Transaction.create({
        ...transaction, buyer: transaction.buyerId
      })
  
      await updateCredits(transaction.buyerId, transaction.credits);
  
      return JSON.parse(JSON.stringify(newTransaction));
    } catch (error) {
      handleError(error)
    }
  }

