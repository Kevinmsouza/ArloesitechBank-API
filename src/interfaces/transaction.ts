import AccountData from "./account";

interface TransactionData {
  accountId?: number
  userId?: number,
  description: string,
  value: number,
  targetAccount: AccountData
}

export default TransactionData;
