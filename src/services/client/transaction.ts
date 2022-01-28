import Transaction from "@/entities/Transaction";
import TransactionData from "@/interfaces/transaction";

export async function deposit(transactionData: TransactionData) {
  return await Transaction.deposit(transactionData);
}

export async function withdraw(transactionData: TransactionData) {
  return await Transaction.withdraw(transactionData);
}

export async function transfer(transactionData: TransactionData) {
  return await Transaction.transfer(transactionData);
}
