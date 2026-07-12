import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, resolve } from "path";
import { mkdirSync } from "fs";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UpdateHomepageDto } from "./dto/homepage.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { HomepageService } from "./homepage.service";

@ApiTags("Homepage CMS")
@Controller("homepage")
export class HomepageController {
  constructor(private readonly homepage: HomepageService) {}
  @Get()
  @ApiOperation({ summary: "Get homepage CMS content" })
  @ApiOkResponse({ description: "Homepage content returned." })
  get() {
    return this.homepage.get();
  }
  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Update all homepage CMS sections" })
  @ApiOkResponse({ description: "Homepage content saved." })
  @ApiBadRequestResponse({ description: "Validation failed." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  update(
    @Body()
    body: UpdateHomepageDto,
  ) {
    return this.homepage.update(body);
  }

  @Post("reset")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({ summary: "Reset homepage content to defaults" })
  @ApiOkResponse({ description: "Homepage content reset." })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  reset() {
    return this.homepage.reset();
  }

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @ApiOperation({
    summary: "Upload a CMS image",
    description: "Accepts JPG, PNG, WEBP or GIF files up to 5 MB.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  @ApiCreatedResponse({
    description: "Image uploaded.",
    example: { url: "/uploads/1720000000000-image.jpg" },
  })
  @ApiBadRequestResponse({
    description: "File is missing, unsupported or too large.",
  })
  @ApiUnauthorizedResponse({
    description: "Administrator cookie is missing or invalid.",
  })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          const directory = resolve(process.cwd(), "../web/public/uploads");
          mkdirSync(directory, { recursive: true });
          callback(null, directory);
        },
        filename: (_request, file, callback) =>
          callback(
            null,
            `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname).toLowerCase()}`,
          ),
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) =>
        callback(
          null,
          ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
            file.mimetype,
          ),
        ),
    }),
  )
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file)
      throw new BadRequestException(
        "Choose a JPG, PNG, WEBP, or GIF image up to 5 MB.",
      );
    return { url: `/uploads/${file.filename}` };
  }
}
