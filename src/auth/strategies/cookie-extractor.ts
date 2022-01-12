import { JwtFromRequestFunction } from "passport-jwt";

export const cookieExtractor: JwtFromRequestFunction = (req) => {
  let token = null;
  if (req && req.signedCookies && req.signedCookies.jwt) {
    token = req.signedCookies["jwt"]["token"];
  }
  return token;
};
