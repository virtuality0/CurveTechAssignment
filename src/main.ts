import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodExceptionFilter } from './filters/zod-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ZodExceptionFilter());
  app.use(cookieParser());

  // Swagger setup for API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CurveTech')
    .setVersion('1.1')
    .build();

  const swaggerFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
