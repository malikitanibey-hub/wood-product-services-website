import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsObject } from "class-validator";
export class UpdateHomepageDto {
  @ApiProperty({
    type: "object",
    example: {
      title: "SOLID WOOD PRODUCTS",
      subtitle: "Oak, beech, ash",
      buttonText: "Order",
      buttonLink: "/contact",
    },
  })
  @IsObject()
  hero!: Record<string, unknown>;
  @ApiProperty({ type: "array", example: [] }) @IsArray() banners!: unknown[];
  @ApiProperty({ type: "array", example: [] })
  @IsArray()
  textSections!: unknown[];
  @ApiProperty({ type: "array", example: [] }) @IsArray() images!: unknown[];
}
