import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength } from "class-validator";

export class SignInLocalDto {
  @IsString()
  @MaxLength(32)
  @IsEmail()
  @ApiProperty({
    example: "zaq1@wsx.com",
    format: "email",
    maxLength: 32,
  })
  email: string;
  @IsString()
  @MaxLength(32)
  @ApiProperty({
    example: "Adrian",
    maxLength: 16,
    minLength: 3,
  })
  password: string;
}
