import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { passwordRequirementsConfig } from "src/config/password-requirements-config";
import { IsEmailAlreadyUsed } from "../decorators";

export class SignUpLocalDto {
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @IsEmail()
  @IsEmailAlreadyUsed()
  email: string;
  @IsString()
  @Matches(passwordRequirementsConfig.getRegex(), { message: passwordRequirementsConfig.getDescription() })
  password: string;
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  @IsOptional()
  username?: string;
}
