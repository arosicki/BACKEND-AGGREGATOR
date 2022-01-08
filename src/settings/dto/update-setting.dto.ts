import { IsInt, IsPositive } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSettingDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ type: "integer", description: "key value", example: 720000 })
  value: number;
}
