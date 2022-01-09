import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { SettingsModule } from "./settings/settings.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forRoot(), SettingsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
