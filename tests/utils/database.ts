import { getConnection, EntityTarget, BaseEntity } from "typeorm";
import Enrollment from "../../src/entities/Enrollment";
import Address from "../../src/entities/Address";
import Session from "../../src/entities/Session";
import User from "../../src/entities/User";
import Transaction from "../../src/entities/Transaction";
import Account from "../../src/entities/Account";

export async function clearTable(entity: EntityTarget<BaseEntity>) {
  return getConnection()
    .createQueryBuilder()
    .delete()
    .from(entity)
    .where("id >= :id", { id: 1 })
    .execute();
}

export async function clearDatabase() {
  await clearTable(Transaction);
  await clearTable(Account);
  await clearTable(Address);
  await clearTable(Enrollment);
  await clearTable(Session);
  await clearTable(User);
}
