import { Request } from "express";
import { TokenPayload } from ".";
import { RefreshTokenPayload } from "./token-payload.interface";

export interface RefreshRequestWithUser extends Request {
  user: RefreshTokenPayload;
}

export interface RequestWithUser extends Request {
  user: TokenPayload;
}
