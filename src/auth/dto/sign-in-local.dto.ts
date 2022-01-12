import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength } from "class-validator";
import { IsAccountExists } from "../decorators";

export class SignInLocalDto {
  @IsString()
  @MaxLength(32)
  @IsEmail()
  @ApiProperty({
    example: "zaq1@wsx.com",
    format: "email",
    maxLength: 32,
  })
  @IsAccountExists()
  email: string;
  @IsString()
  @MaxLength(32)
  @ApiProperty({
    example: "zaq1@WSX",
    maxLength: 32,
  })
  password: string;
}
