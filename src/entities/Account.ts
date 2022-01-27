import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";
import AccountData from "@/interfaces/account";
import ConflictError from "@/errors/ConflictError";
import Enrollment from "./Enrollment";
import CannotCreateAccountBeforeEnrollment from "@/errors/CannotCreateAccountBeforeEnrollment";
import CannotDeleteAccount from "@/errors/CannotDeleteAccount";
import NotFoundError from "@/errors/NotFoundError";

@Entity("accounts")
export default class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column()
  agency: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  balance: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user: User) => user.accounts)
  @JoinColumn()
  user: User;

  getAccount() {
    return{
      id: this.id,
      number: this.number,
      agency: this.agency,
      balance: Number(this.balance),
      createdAt: this.createdAt,
      userId: this.userId
    };
  }

  populateFromData(data: AccountData) {
    this.number = data.number;
    this.agency = data.agency;
    this.balance ||= 0;
    this.userId = data.userId;
  }

  static async createOrUpdate(data: AccountData) {
    const enrollment = await Enrollment.getByUserIdWithAddress(data.userId);
    if(!enrollment) {
      throw new CannotCreateAccountBeforeEnrollment;
    }

    let account = await this.findOne({ where: { number: data.number, agency: data.agency } });
    if(account && account.userId !== data.userId) {
      throw new ConflictError("Account already is linked to another user!");
    }

    account ||= Account.create();
    account.populateFromData(data);
    await account.save();
    return account;
  }

  static async listAccountsByUserId(userId: number) {
    return await this.find({ where: { userId }, order: { createdAt: "ASC" } });
  }

  static async deleteAccount(data: AccountData) {
    const account = await this.findOne({ where: { id: data.id, userId: data.userId } });
    if(!account) throw new NotFoundError();
    if(account.balance > 0) throw new CannotDeleteAccount(account.balance);
    account.remove();
  }

  static async getAccountById(data: AccountData) {
    const account = await this.findOne({ where: { id: data.id, userId: data.userId } });
    if(!account) throw new NotFoundError();
    return account;
  }
}
