import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
export class UpdateSiteContentDto {
  @ApiPropertyOptional({ example: "ANY QUESTIONS?" })
  @IsOptional()
  @IsString()
  title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() body?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() namePlaceholder?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phonePlaceholder?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() questionPlaceholder?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() buttonText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() successTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() successMessage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() formImage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phoneLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() addressLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hoursLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hours?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mapUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subtitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emailLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() passwordLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() footerText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() backgroundImage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() decorativeImage?: string;
}
