import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Token } from ".";

export enum UserTypes {
  BASIC = "basic",
  PREMIUM = "premium",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  constructor(email: string, password: string, username: string, type: UserTypes = UserTypes.BASIC) {
    this.username = username;
    this.password = password;
    this.type = type;
    this.email = email;
  }
  @ApiProperty({ type: "integer", example: 11 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: "string",
    example: "user@foo.bar",
    description: "used to log in",
    minLength: 6,
    maxLength: 32,
  })
  @Column({ type: "varchar", length: 64, unique: true })
  email: string;

  @Column({ type: "varchar", length: 128 })
  password: string;

  @ApiProperty({
    type: "string",
    example: "Adrian",
    description: "app uses it in direct messages to user",
    minLength: 3,
    maxLength: 16,
  })
  @Column({ type: "varchar", length: 16 })
  username: string;

  @ApiProperty({
    type: "string",
    enum: UserTypes,
    example: UserTypes.ADMIN,
  })
  @Column({ type: "enum", enum: UserTypes, default: UserTypes.BASIC })
  type: UserTypes;

  @OneToOne(() => Token, (token) => token.user)
  @JoinColumn()
  token: Token;

  @ApiProperty({ type: "string", format: "dateString", example: "2022-01-22T10:30:40.000Z" })
  @CreateDateColumn({ type: "timestamptz" })
  created: Date;
  @ApiProperty({ type: "string", format: "dateString", example: "2022-01-22T10:30:40.000Z" })
  @UpdateDateColumn({ type: "timestamptz" })
  modified: Date;
}
