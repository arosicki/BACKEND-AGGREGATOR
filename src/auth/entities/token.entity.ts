import { Column, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from ".";

/* Created to prevent changing up modified every time new refresh token is generated */

@Entity("tokens")
export class Token {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "varchar", length: 64 })
  refreshToken: string;
  @OneToOne(() => User, (user) => user.token)
  user: User;
  @UpdateDateColumn()
  modified: Date;
}
