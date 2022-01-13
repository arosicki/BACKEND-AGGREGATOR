import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { CreatedResponseObject, OkResponseObject } from "src/utils/response-object";
import { AuthService } from "./auth.service";
import { SignInLocalDto, SignUpLocalDto } from "./dto";
import { AccessTokenObject } from "./classes";
import { AuthGuard } from "@nestjs/passport";
import { RefreshRequestWithUser } from "./interfaces";
import { ChangePasswordLocalDto } from "./dto/change-password-local.dto";
@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Post("local/signup")
  async signUpLocal(@Body() signUpLocalDto: SignUpLocalDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, accessToken } = await this.authService.signUpLocal(signUpLocalDto);
    const cookieMaxAge = this.configService.get<number>("REFRESH_TOKEN_TTL")!;
    res.cookie("na_rt", refreshToken, { maxAge: cookieMaxAge, httpOnly: true });
    return new CreatedResponseObject<AccessTokenObject>(
      "account succesfully created",
      new AccessTokenObject(accessToken)
    );
  }
  @HttpCode(HttpStatus.OK)
  @Post("local/signin")
  async signInLocal(@Body() signInLocalDto: SignInLocalDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, accessToken } = await this.authService.signInLocal(signInLocalDto);
    const cookieMaxAge = this.configService.get<number>("REFRESH_TOKEN_TTL")!;
    res.cookie("na_rt", refreshToken, { maxAge: cookieMaxAge, httpOnly: true }); // setting it later than jwt expiresIn shouldn't cause issues
    return new OkResponseObject<AccessTokenObject>("succesfully logged in", new AccessTokenObject(accessToken));
  }
  @HttpCode(HttpStatus.OK)
  @Post("local/changepassword")
  async changePasswordLocal(
    @Body() changePasswordLocalDto: ChangePasswordLocalDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, accessToken } = await this.authService.changePassword(changePasswordLocalDto);
    const cookieMaxAge = this.configService.get<number>("REFRESH_TOKEN_TTL")!;
    res.cookie("na_rt", refreshToken, { maxAge: cookieMaxAge, httpOnly: true });
    return new OkResponseObject<AccessTokenObject>("password successfully changed", new AccessTokenObject(accessToken));
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: RefreshRequestWithUser) {
    this.authService.logout(req.user.sub, req.user.refreshToken);
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: RefreshRequestWithUser) {
    this.authService.refreshToken(req.user);
  }
}
