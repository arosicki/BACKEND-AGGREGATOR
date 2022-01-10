import { IsString, MaxLength, MinLength } from "class-validator";

export class signInLocalDto {
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  username: string;
  @IsString()
  @MaxLength(32)
  password: string;
}
