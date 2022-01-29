import AccountData from "../../src/interfaces/account";
import User from "../../src/entities/User";
import { getRepository } from "typeorm";
import Account from "../../src/entities/Account";

export function getValidBody() {
  return {
    number: "21184-4",
    agency: "5706"
  } as AccountData;
}

export function getInvalidBody() {
  return {
    number: "21184-4",
    agency: ""
  } as AccountData;
}

export async function createAccount(user: User) {
  const accountData = getValidBody();
  accountData.userId = user.id;

  const account = getRepository(Account).create(accountData);
  account.balance = 0;
  await getRepository(Account).save(account);

  return account;
}
