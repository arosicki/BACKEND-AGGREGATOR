import { UserTypes } from "./user-types";

export interface TokenPayload {
  sub: number;
  email: string;
  userType: UserTypes;
  username: string;
}

export interface RefreshTokenPayload extends TokenPayload {
  refreshToken: string;
}
