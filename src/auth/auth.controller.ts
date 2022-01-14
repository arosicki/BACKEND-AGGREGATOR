import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { CreatedResponseObject, OkResponseObject } from "src/common/classes/response-object";
import { AuthService } from "./auth.service";
import { SignInLocalDto, SignUpLocalDto, ChangePasswordLocalDto } from "./dto";
import { AccessTokenObject } from "./classes";
import { CurrentUser, Public } from "src/common/decorators";
import { RefreshTokenPayload } from "./interfaces";
import { JwtRefreshGuard } from "src/common/guards";
@Controller("auth")
@ApiTags("auth")
@Public()
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
    return new OkResponseObject<AccessTokenObject>("successfully logged in", new AccessTokenObject(accessToken));
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

  @UseGuards(JwtRefreshGuard)
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: RefreshTokenPayload) {
    await this.authService.logout(user.sub, user.refreshToken);
    return new OkResponseObject<AccessTokenObject>("logged out successfully");
  }

  @UseGuards(JwtRefreshGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(@CurrentUser() user: RefreshTokenPayload) {
    const refreshToken = await this.authService.refreshToken(user);
    return new OkResponseObject<AccessTokenObject>(
      "password successfully changed",
      new AccessTokenObject(refreshToken)
    );
  }
}
