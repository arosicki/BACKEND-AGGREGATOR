import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt") {}
