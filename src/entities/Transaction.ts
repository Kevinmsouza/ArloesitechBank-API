import NotEnoughBalanceError from "@/errors/NotEnoughBalanceError";
import NotFoundError from "@/errors/NotFoundError";
import TransactionData from "@/interfaces/transaction";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Account from "./Account";

@Entity("transactions")
export default class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  value: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column()
  accountId: number;

  @ManyToOne(() => Account, (account: Account) => account.transactions)
  @JoinColumn()
  account: Account;

  populateFromData(data: TransactionData) {
    this.description = data.description;
    this.value = data.value;
    this.accountId = data.targetAccount.id;
  }

  static async registerTransaction(data: TransactionData) {
    const transaction = Transaction.create();
    transaction.populateFromData(data);
    await transaction.save();
    return transaction;
  }  

  static async deposit(data: TransactionData) {
    const targetAccount = await Account.findOne({ 
      where: {
        number: data.targetAccount.number,
        agency: data.targetAccount.agency
      }
    });
    if(!targetAccount) throw new NotFoundError();

    targetAccount.balance = Number(targetAccount.balance) + data.value;
    await targetAccount.save();

    data.description = "Deposit";
    data.targetAccount.id = targetAccount.id;
    return await this.registerTransaction(data);
  }

  static async withdraw(data: TransactionData) {
    const targetAccount = await Account.findOne({ 
      where: {
        number: data.targetAccount.number,
        agency: data.targetAccount.agency,
        userId: data.userId
      }
    });
    if(!targetAccount) throw new NotFoundError();

    const newBalance = Number(targetAccount.balance) + data.value;
    if(newBalance < 0) {
      throw new NotEnoughBalanceError(targetAccount.balance);
    }

    targetAccount.balance = newBalance;
    await targetAccount.save();

    data.description = "Withdraw";
    data.targetAccount.id = targetAccount.id;
    data.value *= -1;
    return await this.registerTransaction(data);
  }
}
