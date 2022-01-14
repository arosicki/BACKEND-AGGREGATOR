import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { hash, verify } from "argon2";
import { LessThan, Repository } from "typeorm";
import { SignInLocalDto, SignUpLocalDto, ChangePasswordLocalDto } from "./dto";
import { Token, User } from "./entities";
import { UserTypes } from "src/common/interfaces/user-types";
import { TokensInterface, RefreshTokenPayload } from "../common/interfaces";

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
    try {
      const passwordHash = await this.hashPassword(password);
      const newUser = new User(email, passwordHash, username);

      await this.userRepository.save(newUser);
      const accessToken = await this.getAccessToken(newUser.id, newUser.email, newUser.username, newUser.type);
      const refreshToken = await this.getRefreshToken(newUser.id, newUser.email, newUser.username, newUser.type);

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async signInLocal({ password, email }: SignInLocalDto): Promise<TokensInterface> {
    try {
      var user = (await this.userRepository.find({ where: { email } }))[0];
      var isPasswordCorrect = await this.verifyPassword(user.password, password);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (!isPasswordCorrect) {
      throw new UnauthorizedException("incorrect password");
    }
    try {
      const accessToken = await this.getAccessToken(user.id, user.email, user.username, user.type);
      const refreshToken = await this.getRefreshToken(user.id, user.email, user.username, user.type);

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async changePassword({ password, email, newPassword }: ChangePasswordLocalDto): Promise<TokensInterface> {
    try {
      var user = (await this.userRepository.find({ where: { email } }))[0];

      var isPasswordCorrect = await this.verifyPassword(user.password, password);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (!isPasswordCorrect) {
      throw new UnauthorizedException("incorrect password");
    }
    try {
      user.password = await this.hashPassword(newPassword);
      this.userRepository.save(user);
      await this.clearUserTokens(user.id);

      const accessToken = await this.getAccessToken(user.id, user.email, user.username, user.type);
      const refreshToken = await this.getRefreshToken(user.id, user.email, user.username, user.type);

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async logout(userId: number, refreshToken: string) {
    try {
      const tokens = await this.tokenRepository.find({ where: { user: userId }, relations: ["user"] });

      for (let token of tokens) {
        const isMatched = await this.verifyToken(token.refreshToken, refreshToken);
        if (isMatched) {
          await this.tokenRepository.remove(token);
          return;
        }
      }
      throw new UnauthorizedException("incorrect refresh token");
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  async refreshToken({ username, sub, email, userType, refreshToken }: RefreshTokenPayload) {
    try {
      const tokens = await this.tokenRepository.find({ where: { user: sub }, relations: ["user"] });

      for (let token of tokens) {
        const isMatched = await this.verifyToken(token.refreshToken, refreshToken);
        if (isMatched) {
          return await this.getAccessToken(sub, email, username, userType);
        }
      }
      throw new UnauthorizedException("incorrect refresh token");
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  private async getAccessToken(userId: number, email: string, username: string, userType: UserTypes) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        username,
        userType,
      },
      {
        expiresIn: this.configService.get<number>("ACCESS_TOKEN_TTL")!,
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET")!,
      }
    );
    return accessToken;
  }
  private async getRefreshToken(userId: number, email: string, username: string, userType: UserTypes) {
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        username,
        userType,
      },
      {
        expiresIn: this.configService.get<number>("REFRESH_TOKEN_TTL")!,
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET")!,
      }
    );
    const refreshTokenHash = await this.hashToken(refreshToken);
    const dbToken = new Token(refreshTokenHash);
    await this.tokenRepository.save(dbToken);
    return refreshToken;
  }
  private async hashPassword(password: string) {
    const passwordHash = await hash(password, {
      secret: Buffer.from(this.configService.get<string>("HASH_SECRET")!, "utf-8"),
    });
    return passwordHash;
  }
  private async verifyPassword(hash: string, password: string) {
    const isPasswordCorrect = await verify(hash, password, {
      secret: Buffer.from(this.configService.get<string>("HASH_SECRET")!, "utf-8"),
    });
    return isPasswordCorrect;
  }
  private async clearUserTokens(id: number) {
    await this.tokenRepository.delete({ user: { id: id } });
  }
  private async hashToken(token: string) {
    const tokenHash = await hash(token, {
      secret: Buffer.from(this.configService.get<string>("HASH_SECRET")!, "utf-8"),
    });
    return tokenHash;
  }
  private async verifyToken(hash: string, token: string) {
    const isCorrect = await verify(hash, token, {
      secret: Buffer.from(this.configService.get<string>("HASH_SECRET")!, "utf-8"),
    });
    return isCorrect;
  }

  @Interval(1000 * 60 * 60 * 24) // every one day
  // @ts-ignore - prevent unuser variable error since it's executed in an interval
  private async deleteOldTokens() {
    await this.tokenRepository.delete({
      created: LessThan(`date + ${this.configService.get<number>("REFRESH_TOKEN_TTL")!}`),
    });
  }
}
