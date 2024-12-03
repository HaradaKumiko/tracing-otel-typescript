import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SetupTracing from './utils/tracing/tracing';

const sdk = SetupTracing();
sdk.start();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
