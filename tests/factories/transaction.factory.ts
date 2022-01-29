import { getRepository } from "typeorm";
import Account from "../../src/entities/Account";
import TransactionData from "../../src/interfaces/transaction";

export function getValidBody() {
  return {
    value: 0.01,
    targetAccount: {
      number: "21184-4",
      agency: "5706"
    }
  } as TransactionData;
}

export function getInvalidBody() {
  return {
    targetAccount: {
      number: "21184-4",
      agency: "5706"
    }
  } as TransactionData;
}

export async function changeBalance(accountData: Account, newBalance: number) {
  const account = await getRepository(Account).findOne({ where: { id: accountData.id } });
  account.balance = newBalance;
  await getRepository(Account).save(account);
  return account;
}
