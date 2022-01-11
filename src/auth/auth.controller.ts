import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreatedResponseObject } from "src/utils/response-object";
import { AuthService } from "./auth.service";
import { SignInLocalDto, SignUpLocalDto } from "./dto";
import { TokensInterface } from "./interfaces";
@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("local/signup")
  async signUpLocal(@Body() signUpLocalDto: SignUpLocalDto) {
    const tokens = await this.authService.signUpLocal(signUpLocalDto);
    return new CreatedResponseObject<TokensInterface>("account succesfully created", tokens);
  }
  @Post("local/signin")
  async signInLocal(@Body() signInLocalDto: SignInLocalDto) {
    this.authService.signInLocal(signInLocalDto);
  }
  @Post("logout")
  async logout() {
    this.authService.logout();
  }
  @Post("refresh")
  async refreshToken() {
    this.authService.refreshToken();
  }
}
