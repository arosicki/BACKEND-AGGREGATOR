import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class SignInLocalDto {
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @IsEmail()
  email: string;
  @IsString()
  @MaxLength(32)
  password: string;
}
