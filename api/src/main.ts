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
import { Logger } from '@nestjs/common';

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

  //swagger init
  const config = new DocumentBuilder()
    .setTitle('Druidia.net API')
    .setDescription('A secure restful resource API.')
    .setVersion('1.0')
    .addTag(AppConstants.SECURE)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(AppConstants.appPort);
  Logger.log('API environment:'+process.env.NODE_ENV);
}
bootstrap();
