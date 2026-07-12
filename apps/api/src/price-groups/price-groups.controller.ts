import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PriceGroupsService } from "./price-groups.service";
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import {
  CreatePriceGroupDto,
  UpdatePriceGroupDto,
} from "./dto/price-group.dto";
@ApiTags("Wood Price Groups")
@Controller("price-groups")
export class PriceGroupsController {
  constructor(private service: PriceGroupsService) {}
  @Get()
  @ApiOperation({
    summary: "List wood price groups",
    description:
      "Returns active and inactive dimensional wood price tables in slideshow order.",
  })
  @ApiOkResponse({
    description: "Price groups returned.",
    example: [
      {
        id: 1,
        name: "dub",
        rows: [["800", "200", "20", "0,0032", "2000", "224"]],
        active: true,
        displayOrder: 1,
      },
    ],
  })
  list() {
    return this.service.list();
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Create a wood price group" })
  @ApiCreatedResponse({ description: "Price group created." })
  @ApiBadRequestResponse({ description: "Validation failed." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  create(@Body() b: CreatePriceGroupDto) {
    return this.service.create(b);
  }
  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Update a wood price group and its rows" })
  @ApiOkResponse({ description: "Price group updated." })
  @ApiBadRequestResponse({ description: "Validation failed." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  @ApiNotFoundResponse({ description: "Price group not found." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() b: UpdatePriceGroupDto,
  ) {
    return this.service.update(id, b);
  }
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Delete a wood price group" })
  @ApiOkResponse({ description: "Price group deleted." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  @ApiNotFoundResponse({ description: "Price group not found." })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
