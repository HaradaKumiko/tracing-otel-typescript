import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TracingInterceptor } from './interceptors/tracing.interceptor';
import { SetupTracing } from './utils/tracing/tracing';

async function bootstrap() {
  // Initialize OpenTelemetry
  const sdk = SetupTracing();
  sdk.start();

  const app = await NestFactory.create(AppModule);
  
  // Use the tracing interceptor globally
  app.useGlobalInterceptors(new TracingInterceptor());
  
  await app.listen(process.env.PORT ?? 3000);

  // Graceful shutdown
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
}
bootstrap();
