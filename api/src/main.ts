import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppConstants } from './app.constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const dateStamp = new Date();
  let app = null;

  app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: AppConstants.winstonTransports,
      // other options
    }),
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  //swagger init
  //if(process.env.NODE_ENV !== 'production'){ //TODO: don't put this to prod.
  const config = new DocumentBuilder()
    .setTitle('The druidia.net API')
    .setDescription('A secure restful resource API.')
    .setVersion(process.env.API_VERSION)
    .addTag(AppConstants.API_TAG)
    .addTag(AppConstants.NFL_TAG)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //}

  await app.listen(AppConstants.appPort);
  Logger.log(`[API ENVIRONMENT: ${process.env.NODE_ENV}]`);
  Logger.log(`[API VERSION: ${process.env.API_VERSION}]`);
  //Logger.log(`[DB USER: ${process.env.MYSQL_USER}]`);
}
bootstrap();
