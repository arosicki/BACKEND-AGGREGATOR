import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { cookieExtractor } from "./cookie-extractor";
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: configService.get<string>("REFRESH_TOKEN_SECRET")!,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: TokenPayload) {
    const refreshToken = req.signedCookies("na_rt");
    return {
      ...payload,
      refreshToken,
    };
  }
}
