import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import cookieParser = require("cookie-parser");
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { resolve } from "path";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  
  app.useStaticAssets(resolve(process.cwd(), "../web/public/uploads"), {
    prefix: "/uploads/",
  });
  app.setGlobalPrefix("api");

  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("BIO CWT CMS API")
    .setDescription(
      "Documented REST API for authentication and public website content management.",
    )
    .setVersion("1.0.0")
    .addCookieAuth("access_token", {
      type: "apiKey",
      in: "cookie",
      description: "HTTP-only administrator access token cookie.",
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  const port = Number(process.env.PORT) || 4000;

  await app.listen(port, "0.0.0.0");

  console.log(`API running on port ${port}`);
  console.log(`Swagger available at /api/docs`);
}

void bootstrap();
