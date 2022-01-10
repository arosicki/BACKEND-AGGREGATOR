import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {}
