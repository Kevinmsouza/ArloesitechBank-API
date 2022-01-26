import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";
import AccountData from "@/interfaces/account";
import ConflictError from "@/errors/ConflictError";
import Enrollment from "./Enrollment";
import CannotCreateAccountBeforeEnrollment from "@/errors/CannotCreateAccountBeforeEnrollment";

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
}
