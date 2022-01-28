import Account from "@/entities/Account";

interface TransferData {
  account: Account,
  value: number,
}

export default TransferData;
