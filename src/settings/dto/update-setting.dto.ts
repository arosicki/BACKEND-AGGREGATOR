import { IsInt, IsPositive, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSettingDto {
  @IsInt()
  @IsPositive()
  @Min(1000 * 60 * 5) // 5mins
  @ApiProperty({ type: "integer", description: "key value", example: 720000 })
  value: number;
}
