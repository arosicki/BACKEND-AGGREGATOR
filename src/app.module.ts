import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { SettingsModule } from "./settings/settings.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { envValidator } from "./utils/env-validator";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    SettingsModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, validate: envValidator, cache: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
