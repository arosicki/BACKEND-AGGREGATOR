import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
interface RefreshTokenPayload {
  id: number;
}
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET!,
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
