import NotEnoughBalanceError from "@/errors/NotEnoughBalanceError";
import NotFoundError from "@/errors/NotFoundError";
import TransactionData from "@/interfaces/transaction";
import TransferData from "@/interfaces/transfer";
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

  static async transfer(data: TransactionData) {
    async function executeTransfer(transferData: TransferData) {
      const { account, value } = transferData;
      const isReceiving = value > 0;

      account.balance = Number(account.balance) + value;
      await account.save();

      const transactionData = {
        description: `Transfer ${isReceiving? "from" : "to"} ${targetAccount.agency} ${targetAccount.number}`,
        value: value,
        targetAccount: account
      } as TransactionData;
      return await Transaction.registerTransaction(transactionData);
    }

    const userAccount = await Account.findOne({ where: { id: data.accountId, userId: data.userId } });
    const targetAccount = await Account.findOne({ 
      where: {
        number: data.targetAccount.number,
        agency: data.targetAccount.agency
      }
    });
    if(!userAccount || !targetAccount) throw new NotFoundError();
    const newBalance = Number(userAccount.balance) - data.value;
    if(newBalance < 0) {
      throw new NotEnoughBalanceError(userAccount.balance);
    }

    const userTransferData = {
      account: userAccount,
      value: -data.value,
    } as TransferData;
    const transaction = await executeTransfer(userTransferData);

    const targetTransferData = {
      account: targetAccount,
      value: data.value,
    } as TransferData;
    await executeTransfer(targetTransferData);

    return transaction;
  }
}
