import Account from "@/entities/Account";
import AccountData from "@/interfaces/account";

export async function createOrUpdate(accountData: AccountData) {
  const account = await Account.createOrUpdate(accountData);
  return account.getAccount();  
}

export async function listAccountsByUserId(userId: number) {
  const accounts = await Account.listAccountsByUserId(userId);
  return accounts.map((account) => account.getAccount());  
}

export async function deleteAccount(accountData: AccountData) {
  return await Account.deleteAccount(accountData);
}
