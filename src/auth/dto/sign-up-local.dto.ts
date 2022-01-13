import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { passwordRequirementsConfig } from "src/config/password-requirements-config";
import { IsEmailAlreadyUsed } from "../../common/decorators";

export class SignUpLocalDto {
  @IsString()
  @MaxLength(32)
  @IsEmail()
  @IsEmailAlreadyUsed()
  @ApiProperty({
    example: "zaq1@wsx.com",
    format: "email",
    maxLength: 32,
  })
  email: string;
  @IsString()
  @MaxLength(32)
  @Matches(passwordRequirementsConfig.getRegex(), { message: passwordRequirementsConfig.getDescription() })
  @ApiProperty({
    example: "zaq1@WSX",
    format: "password",
    maxLength: 32,
    description: "password requirements may vary depending on config",
  })
  password: string;
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  @ApiProperty({
    example: "Adrian",
    maxLength: 16,
    minLength: 3,
  })
  username: string;
}
