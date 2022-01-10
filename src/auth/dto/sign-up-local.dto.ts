import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { passwordRequirementsConfig } from "src/config/password-requirements-config";

export class signUpLocalDto {
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  username: string;
  @IsString()
  @Matches(passwordRequirementsConfig.getRegex(), { message: passwordRequirementsConfig.getDescription() })
  password: string;
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  @IsOptional()
  name?: string;
}
