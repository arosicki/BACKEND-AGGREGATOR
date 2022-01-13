import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength } from "class-validator";
import { passwordRequirementsConfig } from "src/config/password-requirements-config";
import { IsAccountExists } from "../../common/decorators";

export class ChangePasswordLocalDto {
  @IsString()
  @MaxLength(32)
  @IsEmail()
  @IsAccountExists()
  @ApiProperty({
    example: "zaq1@wsx.com",
    format: "email",
    maxLength: 32,
  })
  email: string;

  @IsString()
  @MaxLength(32)
  @ApiProperty({
    example: "zaq1@WSX",
    maxLength: 32,
  })
  password: string;

  @IsString()
  @MaxLength(32)
  @Matches(passwordRequirementsConfig.getRegex(), { message: passwordRequirementsConfig.getDescription() })
  @ApiProperty({
    example: "xsw2!QAZ",
    format: "password",
    maxLength: 32,
    description: "password requirements may vary depending on config",
  })
  newPassword: string;
}
