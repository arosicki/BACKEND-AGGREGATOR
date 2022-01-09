import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserTypes {
  BASIC = "basic",
  PREMIUM = "premium",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  constructor(username: string, password: string, name: string, type: UserTypes = UserTypes.BASIC) {
    this.username = username;
    this.password = password;
    this.type = type;
    this.name = name ? name : username;
  }
  @ApiProperty({ type: "integer", example: 11 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: "string", example: "pussydestroyer69", description: "used to log in" })
  @Column({ type: "varchar", length: 64 })
  username: string;

  @Column({ type: "varchar", length: 64 })
  password: string;

  @ApiProperty({ type: "string", example: "Adrian", description: "app uses it in direct messages to user" })
  @Column()
  name: string;

  @ApiProperty({
    type: "string",
    enum: UserTypes,
    example: "admin",
  })
  @Column({ type: "enum", enum: UserTypes, default: UserTypes.BASIC })
  type: UserTypes;

  @ApiProperty({ type: "string", format: "dateString", example: "2022-01-22T10:30:40.000Z" })
  @CreateDateColumn()
  created: Date;
  @ApiProperty({ type: "string", format: "dateString", example: "2022-01-22T10:30:40.000Z" })
  @UpdateDateColumn()
  modified: Date;
}
