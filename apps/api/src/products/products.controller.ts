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
import { ProductsService } from "./products.service";
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
  CreateGalleryImageDto,
  CreateProductDto,
  UpdateGalleryImageDto,
  UpdateProductDto,
} from "./dto/product.dto";
@ApiTags("Products / Wood Types")
@Controller()
export class ProductsController {
  constructor(private s: ProductsService) {}
  @Get("products")
  @ApiOperation({ summary: "List products and wood types" })
  @ApiOkResponse({
    description: "Products returned.",
    example: [
      {
        id: 1,
        name: "Oak",
        category: "Hardwood",
        characteristics: ["+Durability", "-Expensive"],
        active: true,
      },
    ],
  })
  list() {
    return this.s.list();
  }
  @Post("products")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Create a product or wood type" })
  @ApiCreatedResponse({ description: "Product created." })
  @ApiBadRequestResponse({ description: "Validation failed." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  create(@Body() b: CreateProductDto) {
    return this.s.create(b);
  }
  @Patch("products/:id")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Update a product or wood type" })
  @ApiOkResponse({ description: "Product updated." })
  @ApiBadRequestResponse({ description: "Validation failed." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  @ApiNotFoundResponse({ description: "Product not found." })
  update(@Param("id", ParseIntPipe) id: number, @Body() b: UpdateProductDto) {
    return this.s.update(id, b);
  }
  @Delete("products/:id")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Delete a product or wood type" })
  @ApiOkResponse({ description: "Product deleted." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  @ApiNotFoundResponse({ description: "Product not found." })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.s.remove(id);
  }
  @Get("gallery-images")
  @ApiTags("Gallery Images")
  @ApiOperation({ summary: "List shared gallery slideshow images" })
  @ApiOkResponse({ description: "Gallery images returned." })
  gallery() {
    return this.s.gallery();
  }
  @Post("gallery-images")
  @UseGuards(JwtAuthGuard)
  @ApiTags("Gallery Images")
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Add a gallery slideshow image" })
  @ApiCreatedResponse({ description: "Gallery image created." })
  @ApiBadRequestResponse({ description: "Validation failed." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  add(@Body() b: CreateGalleryImageDto) {
    return this.s.addImage(b);
  }
  @Patch("gallery-images/:id")
  @UseGuards(JwtAuthGuard)
  @ApiTags("Gallery Images")
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Update a gallery slideshow image" })
  @ApiOkResponse({ description: "Gallery image updated." })
  @ApiBadRequestResponse({ description: "Validation failed." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  @ApiNotFoundResponse({ description: "Gallery image not found." })
  edit(
    @Param("id", ParseIntPipe) id: number,
    @Body() b: UpdateGalleryImageDto,
  ) {
    return this.s.editImage(id, b);
  }
  @Delete("gallery-images/:id")
  @UseGuards(JwtAuthGuard)
  @ApiTags("Gallery Images")
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Delete a gallery slideshow image" })
  @ApiOkResponse({ description: "Gallery image deleted." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  @ApiNotFoundResponse({ description: "Gallery image not found." })
  del(@Param("id", ParseIntPipe) id: number) {
    return this.s.deleteImage(id);
  }
}
