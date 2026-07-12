import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
export class CreatePriceGroupDto {
  @ApiProperty({ example: "dub" }) @IsString() name!: string;
  @ApiProperty({
    type: "array",
    example: [["800", "200", "20", "0,0032", "2000", "224"]],
    description:
      "Rows contain length, width, thickness, volume, price per m3 and item price.",
  })
  @IsArray()
  rows!: string[][];
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
export class UpdatePriceGroupDto extends PartialType(CreatePriceGroupDto) {}
