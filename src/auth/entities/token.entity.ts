import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from ".";

/* Created to prevent changing up modified every time new refresh token is generated */

@Entity("tokens")
export class Token {
  constructor(token: string) {
    this.refreshToken = token;
  }
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "varchar", length: 256 })
  refreshToken: string;
  @ManyToOne(() => User, (user) => user.token)
  user: User;
  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
}
