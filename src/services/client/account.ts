import Account from "@/entities/Account";
import AccountData from "@/interfaces/account";

export async function createOrUpdate(accountData: AccountData) {
  const account = await Account.createOrUpdate(accountData);
  return account.getAccount();  
}
