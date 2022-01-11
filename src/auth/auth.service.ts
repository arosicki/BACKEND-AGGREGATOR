import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { hash } from "argon2";
import { Repository } from "typeorm";
import { SignInLocalDto, SignUpLocalDto } from "./dto";
import { Token, User, UserTypes } from "./entities";
import { TokensInterface } from "./interfaces";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly configService: ConfigService
  ) {}

  async signUpLocal({ username, password, email }: SignUpLocalDto): Promise<TokensInterface> {
    const passwordHash = await hash(password, {
      secret: Buffer.from(this.configService.get<string>("HASH_SECRET")!, "utf-8"),
    });
    const newUser = new User(email, passwordHash, username);
    await this.userRepository.save(newUser);

    const accessToken = await this.getAccessToken(newUser.id, newUser.email, newUser.type);
    const refreshToken = await this.getRefreshToken(newUser.id, newUser.email);
    const refreshTokenHash = await hash(refreshToken, {
      secret: Buffer.from(this.configService.get<string>("HASH_SECRET")!, "utf-8"),
    });
    const refreshTokenObject = new Token(refreshTokenHash);
    await this.tokenRepository.save(refreshTokenObject);
    newUser.token = refreshTokenObject;
    await this.userRepository.save(newUser);
    return {
      accessToken,
      refreshToken,
    };
  }
  async signInLocal(_signInLocalDto: SignInLocalDto) {}
  async logout() {}
  async refreshToken() {}

  private async getAccessToken(userId: number, email: string, userType: UserTypes) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        userType,
      },
      {
        expiresIn: this.configService.get<string>("ACCESS_TOKEN_TTL")!,
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET")!,
      }
    );
    return accessToken;
  }
  private async getRefreshToken(userId: number, email: string) {
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: this.configService.get<string>("REFRESH_TOKEN_TTL")!,
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET")!,
      }
    );
    return refreshToken;
  }
}
