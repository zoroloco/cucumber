import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { AppConstants } from './app.constants';
import { AppModule } from './app.module';
import path = require('path');
const fs = require('fs');
import { Logger, ValidationPipe } from '@nestjs/common';

const httpsOptions =  {
  key: fs.readFileSync(process.env.KEY_PATH, 'utf8'),
  cert: fs.readFileSync(process.env.CERT_PATH,'utf8')
};

async function bootstrap() {
  const dateStamp = new Date();
  let app = null;

  if(process.env.NODE_ENV === 'production'){
    app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger({
        transports: AppConstants.winstonTransports
        // other options
      }),httpsOptions
    });
  }else{
    app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger({
        transports: AppConstants.winstonTransports
        // other options
      })
    });
  }
  

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: process.env.NODE_ENV === 'production'
  }));

  //swagger init
  //if(process.env.NODE_ENV !== 'production'){ //TODO: don't put this to prod.
    const config = new DocumentBuilder()
    .setTitle('The druidia.net API')
    .setDescription('A secure restful resource API.')
    .setVersion(process.env.API_VERSION)
    .addTag(AppConstants.API_TAG)    
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //}

  await app.listen(AppConstants.appPort);
  Logger.log('API environment:'+process.env.NODE_ENV);
  Logger.log('API version:'+process.env.API_VERSION);
}
bootstrap();
