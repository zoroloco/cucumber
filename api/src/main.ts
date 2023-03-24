import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { AppConstants } from './app.constants';
import { AppModule } from './app.module';
import * as conf from './conf.json';
import path = require('path');

async function bootstrap() {
  const dateStamp = new Date();

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.colorize({
              colors: {
                error: 'red',
                debug: 'blue',
                warn: 'yellow',
                data: 'grey',
                info: 'green',
                verbose: 'cyan',
              },
            }),
            nestWinstonModuleUtilities.format.nestLike(conf.title, {
              // options
            }),
          ),
        }),
        new winston.transports.File({
          filename: path.join(
            __dirname,
            '../logs/',
            conf.title +
              '-' +
              (dateStamp.getMonth() + 1) +
              '-' +
              dateStamp.getDate() +
              '-' +
              dateStamp.getFullYear() +
              '.log',
          ),
          maxFiles: 256,
          maxsize: 4194304,
          handleExceptions: true,
        }),

        // other transports...
      ],
      // other options
    }),
  });

  app.enableCors();

  //swagger init
  const config = new DocumentBuilder()
    .setTitle('API Tool')
    .setDescription('All purpose API tool')
    .setVersion('1.0')
    .addTag(AppConstants.SECURE)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(AppConstants.appPort);

}
bootstrap();
