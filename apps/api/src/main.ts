import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import cookieParser = require("cookie-parser");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

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

  await app.listen(4000);

  console.log("API: http://localhost:4000/api");
  console.log("Swagger: http://localhost:4000/api/docs");
}

void bootstrap();
