import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

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
  userId: string;

  @ManyToOne(() => User, (user: User) => user.accounts)
  @JoinColumn()
  user: User;
}
