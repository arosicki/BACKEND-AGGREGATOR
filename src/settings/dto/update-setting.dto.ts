import { IsInt, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSettingDto {
  @IsString()
  @ApiProperty({
    description: "setting key name",
    minLength: 6,
    maxLength: 64,
    required: false,
    example: "MAX_NEWS_AGE",
  })
  @Length(6, 64)
  @IsOptional()
  key?: string;
  @IsInt()
  @IsOptional()
  @ApiProperty({ type: "integer", description: "key value", required: false, example: 720000 })
  value?: number;
}
