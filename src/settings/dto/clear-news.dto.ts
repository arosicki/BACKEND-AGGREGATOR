import { IsBoolean, IsDate, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class ClearNewsDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({
    example: "2022-01-22T10:30:40.000Z",
    description:
      "all news modified before given date will be deleted, when parameter is not given value from app settings is used, iso 8601 date string format advised",
    format: "DateString",
    maxLength: 32,
    required: false,
  })
  date: Date;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    default: false,
    description: "determines if archivized news will be deleted",
    required: false,
  })
  deleteArchivized: boolean;
}
