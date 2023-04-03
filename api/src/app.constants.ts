import path = require('path');
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';


export class AppConstants {
  static dateStamp = new Date();

  static appTitle = 'API';

  static appPort = process.env.REACT_APP_API_PORT || 3001;

  static appEnv: string = process.env.NODE_ENV || 'development';
  static appSecret: string = process.env.API_APP_SECRET;

  static winstonTransports = [
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
        nestWinstonModuleUtilities.format.nestLike(AppConstants.appTitle, {
          // options
        }),
      ),
    }),
    new winston.transports.File({
      filename: path.join(
        __dirname,
        '../logs/',
        AppConstants.appTitle +
          '-' +
          (this.dateStamp.getMonth() + 1) +
          '-' +
          this.dateStamp.getDate() +
          '-' +
          this.dateStamp.getFullYear() +
          '.log',
      ),
      maxFiles: 256,
      maxsize: 4194304,
      handleExceptions: true,
    }),

    // other transports...
  ];

  //endpoints
  static TEST: string = "test";
  static TEST_GET_USERS: string = "users";

  //swagger tags
  static SECURE: string = 'secure';

  //swagger description
  static TEST_USERS = "Returns users that are part of a test database.";  
}
