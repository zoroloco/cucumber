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

  //swagger tags (sections)
  static API_TAG = 'API';

  //root
  static API_PATH: string = 'api';

  //api endpoints
  static FIND_ALL_USERS: string = 'find-all-users';
  static FIND_USER_BY_USERNAME = 'find-user-by-username';
  static FIND_USERS_BY_SEARCH_PARAMS = 'find-users-by-search-params';
  static CREATE_USER = 'create-user';
  static LOGIN: string = 'login';
  static VALIDATE_TOKEN: string = 'validate-token';
  static FIND_USER_ASSOCIATIONS_BY_USER = 'find-user-associations-by-user_id/:userid';

  //swagger description
  static LOGIN_DESC =
    'Validates credentials. Returns signed JWT if successful. 401 otherwise. Updates last login time.';
  static FIND_ALL_USERS_DESC = 'Returns all active users.';
  static FIND_USER_BY_USERNAME_DESC = 'Returns user given a username.';
  static FIND_USERS_BY_SEARCH_PARAMS_DESC = 'Returns active users matching only the query string in the request. All other parameters are ignored.';
  static CREATE_USER_DESC = 'Registers a user.';
  static VALIDATE_TOKEN_DESC =
    'Provides a way for clients to see if their token is valid.';
  static FIND_USER_ASSOCIATIONS_BY_USER_DESC = 'Returns all the user associations given a user id. This is the friend list.';

  //bcrypt
  static BCRYPT_SALT_ROUNDS = 10;
}
