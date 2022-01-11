import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
interface RefreshTokenPayload {
  id: number;
  email: string;
}
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("REFRESH_TOKEN_SECRET")!,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: RefreshTokenPayload) {
    const refreshToken = req.get("Authorization")?.replace("Bearer", "").trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}
