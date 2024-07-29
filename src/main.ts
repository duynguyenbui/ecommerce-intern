import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('E-commerce Api')
    .setDescription('List APIs')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('category')
    .addTag('color')
    .addTag('size')
    .addTag('tag')
    .addTag('user')
    .addTag('product')
    .addTag('order')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });
  await app.listen(process.env.APP_PORT || 4001);
}
bootstrap();
