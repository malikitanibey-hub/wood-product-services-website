import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";
export class CreateServiceDto {
  @ApiProperty({ example: "Custom Furniture" })
  @IsString()
  @MinLength(2)
  name!: string;
  @ApiProperty({
    example: "High-quality custom furniture made from premium wood.",
  })
  @IsString()
  shortDescription!: string;
  @ApiPropertyOptional({
    example: "Furniture built to the customer's measurements.",
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiPropertyOptional({ example: "/uploads/service.jpg" })
  @IsOptional()
  @IsString()
  image?: string;
  @ApiProperty({ example: "Furniture", default: "General" })
  @IsString()
  category!: string;
  @ApiPropertyOptional({ example: "From 5,600 CZK" })
  @IsOptional()
  @IsString()
  price?: string;
  @ApiProperty({ example: true, default: true }) @IsBoolean() active!: boolean;
  @ApiProperty({ example: 1, minimum: 0 })
  @IsInt()
  @Min(0)
  displayOrder!: number;
}
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
