import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { validationPipeConfig } from "./config/validation-pipe-config";

(async () => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

  const config = new DocumentBuilder()
    .setTitle("News Aggregator")
    .setDescription("News Aggregator API")
    .setVersion("1.0.0")
    .setLicense("MIT License", "https://opensource.org/licenses/MIT")
    .setContact("Adrian Rosicki", "", "")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  const configService = app.get(ConfigService);
  app.use(cookieParser(configService.get("COOKIE_SECRET")!));
  await app.listen(configService.get("PORT") as number);
})();
