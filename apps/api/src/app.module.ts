import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthController } from "./health.controller";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { HomepageModule } from "./homepage/homepage.module";
import { ServicesModule } from "./services/services.module";
import { PriceGroupsModule } from "./price-groups/price-groups.module";
import { ProductsModule } from "./products/products.module";
import { SiteContentModule } from "./site-content/site-content.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    PrismaModule,
    AuthModule,
    HomepageModule,
    ServicesModule,
    PriceGroupsModule,
    ProductsModule,
    SiteContentModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
