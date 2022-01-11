import { plainToClass } from "class-transformer";
import { IsInt, IsString, Max, Min, MinLength, validateSync } from "class-validator";

class EnvironmentVariables {
  @IsString()
  @MinLength(8)
  PASSWORD_SECRET: string;
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number;
  @IsString()
  @MinLength(8)
  ACCESS_TOKEN_SECRET: string;

  @IsInt()
  @Min(60)
  ACCESS_TOKEN_TTL: number;

  @IsString()
  @MinLength(8)
  REFRESH_TOKEN_SECRET: string;

  @IsInt()
  @Min(60 * 60)
  REFRESH_TOKEN_TTL: number;
}

export function envValidator(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
