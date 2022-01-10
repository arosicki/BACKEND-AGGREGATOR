import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignInLocalDto, SignUpLocalDto } from "./dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("local/signup")
  async signUpLocal(@Body() signUpLocalDto: SignUpLocalDto) {
    this.authService.signUpLocal(signUpLocalDto);
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
