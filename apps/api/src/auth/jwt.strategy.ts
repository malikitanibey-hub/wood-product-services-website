import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { JwtPayload } from "./jwt-payload.type";

const accessCookie = (request: Request): string | null =>
  (request.cookies as Record<string, string> | undefined)?.access_token ?? null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>("JWT_ACCESS_SECRET");
    if (!secret || secret.length < 32)
      throw new Error("JWT_ACCESS_SECRET must be at least 32 characters");
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([accessCookie]),
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.sub || !payload.email) throw new UnauthorizedException();
    return payload;
  }
}
