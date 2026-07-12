import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { SiteContentService } from "./site-content.service";
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UpdateSiteContentDto } from "./dto/site-content.dto";
@ApiTags("Shared Site Content")
@Controller("site-content")
export class SiteContentController {
  constructor(private s: SiteContentService) {}
  @Get()
  @ApiOperation({ summary: "Get shared About, Contact and Login content" })
  @ApiOkResponse({ description: "Shared CMS content returned." })
  get() {
    return this.s.get();
  }
  @Patch(":section")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({
    summary: "Update a shared content section",
    description: "Updates one of: about, contact or login.",
  })
  @ApiParam({ name: "section", enum: ["about", "contact", "login"] })
  @ApiOkResponse({ description: "Content section updated." })
  @ApiBadRequestResponse({ description: "Invalid section or body." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  update(
    @Param("section") section: string,
    @Body() body: UpdateSiteContentDto,
  ) {
    return this.s.update(section, body);
  }
  @Post(":section/reset")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Reset a shared content section to defaults" })
  @ApiParam({ name: "section", enum: ["about", "contact", "login"] })
  @ApiOkResponse({ description: "Content section reset." })
  @ApiBadRequestResponse({ description: "Invalid section." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  reset(@Param("section") section: string) {
    return this.s.reset(section);
  }
}
