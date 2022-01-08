import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("settings")
export class Setting {
  constructor(key: string, value: number, default_value: number, description: string) {
    this.value = value;
    this.key = key;
    this.default_value = default_value;
    this.description = description;
  }
  @ApiProperty({ type: "integer", example: 11 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ type: "string", example: "MAX_NEWS_AGE" })
  @Column({ type: "varchar", length: 64 })
  key: string;
  @ApiProperty({ type: "integer", example: 7200000 })
  @Column({ type: "int" })
  value: number;
  @ApiProperty({ type: "integer", example: 3600000 })
  @Column({ type: "int" })
  default_value: number;
  @ApiProperty({ type: "string", maxLength: 256, example: "[ms] defines how long news are stored in database" })
  @Column({ type: "varchar", length: 256, nullable: true /* Temporary */ })
  description: string;
}
