import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ProductController } from "src/controllers/product.controller";
import { PrismaModule } from "src/database/prisma/prisma.module";
import { ProductRepository } from "src/repositories/product.repo";
import { ProductService } from "src/services/product.service";

@Module({
    imports: [PrismaModule],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository]
  })

export class ProductModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply().forRoutes('products');
    }
  }