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
import { CreateServiceDto, UpdateServiceDto } from "./dto/service.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ServicesService } from "./services.service";

@ApiTags("Services CMS")
@Controller("services")
export class ServicesController {
  constructor(private readonly services: ServicesService) {}
  @Get()
  @ApiOperation({
    summary: "List services",
    description:
      "Returns all public and inactive CMS service records in display order.",
  })
  @ApiOkResponse({
    description: "Services returned.",
    example: [
      {
        id: 1,
        name: "Custom Furniture",
        category: "Furniture",
        active: true,
        displayOrder: 1,
      },
    ],
  })
  list() {
    return this.services.list();
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Create a service" })
  @ApiCreatedResponse({ description: "Service created successfully." })
  @ApiBadRequestResponse({ description: "Validation failed." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  create(@Body() body: CreateServiceDto) {
    return this.services.create(body);
  }
  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Update a service" })
  @ApiOkResponse({ description: "Service updated." })
  @ApiBadRequestResponse({ description: "Validation failed." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  @ApiNotFoundResponse({ description: "Service not found." })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateServiceDto,
  ) {
    return this.services.update(id, body);
  }
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Delete a service" })
  @ApiOkResponse({ description: "Service deleted." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  @ApiNotFoundResponse({ description: "Service not found." })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.services.remove(id);
  }
}
