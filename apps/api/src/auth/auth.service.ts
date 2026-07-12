import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { JwtPayload } from "./jwt-payload.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(input: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.trim().toLowerCase() },
    });
    if (!user || !(await compare(input.password, user.passwordHash)))
      throw new UnauthorizedException("Invalid email or password");
    return this.issueTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  async refresh(token: string | undefined) {
    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.secret("JWT_REFRESH_SECRET"),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (
        !user?.refreshTokenHash ||
        !(await compare(token, user.refreshTokenHash))
      )
        throw new UnauthorizedException();
      return this.issueTokens({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
    } catch {
      throw new UnauthorizedException("Refresh token is invalid or expired");
    }
  }

  async logout(userId?: number) {
    if (userId)
      await this.prisma.user.updateMany({
        where: { id: userId },
        data: { refreshTokenHash: null },
      });
  }

  private async issueTokens(payload: JwtPayload) {
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.secret("JWT_ACCESS_SECRET"),
      expiresIn: "15m",
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.secret("JWT_REFRESH_SECRET"),
      expiresIn: "7d",
    });
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { refreshTokenHash: await hash(refreshToken, 12) },
    });
    return {
      accessToken,
      refreshToken,
      user: { id: payload.sub, email: payload.email, role: payload.role },
    };
  }

  private secret(name: string): string {
    const value = this.config.get<string>(name);
    if (!value || value.length < 32)
      throw new Error(`${name} must be at least 32 characters`);
    return value;
  }
}
