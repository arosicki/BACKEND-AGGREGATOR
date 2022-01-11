import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategies";

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})], // different secrets for access and refresh token
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
