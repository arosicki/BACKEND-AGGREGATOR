import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserTypes } from "../entities";

interface AccessTokenPayload {
  id: number;
  email: string;
  userType: UserTypes;
}
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("ACCESS_TOKEN_SECRET")!,
    });
  }
  validate = (payload: AccessTokenPayload) => payload;
}
