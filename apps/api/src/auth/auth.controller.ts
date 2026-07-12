import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtPayload } from "./jwt-payload.type";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/",
};

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Sign in as an administrator" })
  @ApiOkResponse({
    description: "Login successful; access and refresh cookies are set.",
    example: { user: { id: 1, email: "admin@biocwt.com", role: "ADMIN" } },
  })
  @ApiBadRequestResponse({
    description: "Email or password validation failed.",
  })
  @ApiUnauthorizedResponse({ description: "Invalid email or password." })
  async login(
    @Body() input: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.login(input);
    this.setCookies(response, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @Post("refresh")
  @HttpCode(200)
  @ApiOperation({
    summary: "Rotate authentication tokens",
    description:
      "Uses the HTTP-only refresh_token cookie and issues new access and refresh cookies.",
  })
  @ApiOkResponse({
    description: "Tokens refreshed.",
    example: { user: { id: 1, email: "admin@biocwt.com", role: "ADMIN" } },
  })
  @ApiUnauthorizedResponse({
    description: "Refresh token is missing, invalid or expired.",
  })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = (request.cookies as Record<string, string> | undefined)
      ?.refresh_token;
    const result = await this.auth.refresh(token);
    this.setCookies(response, result.accessToken, result.refreshToken);
    return { user: result.user };
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @Get("me")
  @ApiOperation({ summary: "Get the authenticated administrator" })
  @ApiOkResponse({ description: "Current administrator returned." })
  @ApiUnauthorizedResponse({
    description: "Access cookie is missing, invalid or expired.",
  })
  me(@Req() request: Request & { user?: JwtPayload }) {
    if (!request.user) throw new UnauthorizedException();
    return { user: request.user };
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth("access_token")
  @Post("logout")
  @HttpCode(204)
  @ApiOperation({ summary: "Sign out the administrator" })
  @ApiNoContentResponse({
    description: "Refresh token invalidated and cookies cleared.",
  })
  @ApiUnauthorizedResponse({
    description: "Access cookie is missing, invalid or expired.",
  })
  async logout(
    @Req() request: Request & { user?: JwtPayload },
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.auth.logout(request.user?.sub);
    response.clearCookie("access_token", cookieOptions);
    response.clearCookie("refresh_token", cookieOptions);
  }

  private setCookies(response: Response, access: string, refresh: string) {
    response.cookie("access_token", access, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    response.cookie("refresh_token", refresh, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
