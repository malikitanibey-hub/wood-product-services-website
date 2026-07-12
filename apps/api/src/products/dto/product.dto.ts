import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
export class CreateProductDto {
  @ApiProperty({ example: "Oak" }) @IsString() name!: string;
  @ApiProperty({ example: "Hardwood" }) @IsString() category!: string;
  @ApiPropertyOptional({ example: "/uploads/oak.jpg" })
  @IsOptional()
  @IsString()
  image?: string;
  @ApiProperty({ example: ["+Durability", "-Expensive"], type: [String] })
  @IsArray()
  @IsString({ each: true })
  characteristics!: string[];
  @ApiProperty({ example: true }) @IsBoolean() active!: boolean;
  @ApiProperty({ example: 1 }) @IsInt() @Min(0) displayOrder!: number;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}
export class CreateGalleryImageDto {
  @ApiProperty({ example: "Oak kitchen" }) @IsString() title!: string;
  @ApiProperty({ example: "/uploads/kitchen.jpg" }) @IsString() image!: string;
  @ApiProperty({ example: "Modern oak kitchen" }) @IsString() alt!: string;
  @ApiProperty({ example: true }) @IsBoolean() active!: boolean;
  @ApiProperty({ example: 1 }) @IsInt() @Min(0) displayOrder!: number;
}
export class UpdateGalleryImageDto extends PartialType(CreateGalleryImageDto) {}
