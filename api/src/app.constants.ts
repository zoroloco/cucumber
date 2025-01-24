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
  static NFL_TAG = 'NFL';

  //root
  static API_PATH: string = 'api';

  //api endpoints
  static FIND_ALL_USER_ROLES_HEAVY_BY_SEARCH_PARAMS: string =
    'find-all-user-roles-heavy-by-search-params';
  static FIND_USER_BY_USERNAME = 'find-user-by-username';
  static FIND_USERS_BY_SEARCH_PARAMS = 'find-users-by-search-params';
  static CREATE_USER = 'create-user';
  static LOGIN: string = 'login';
  static VALIDATE_TOKEN: string = 'validate-token';
  static FIND_USER_ROLE_REFS_FOR_USER = 'find-user-role-refs-for-user';
  static FIND_ALL_CACHED_USER_ROLE_REFS = 'find-all-cached-user-role-refs';
  static FIND_ALL_CACHED_USER_ROLE_REF_ENDPOINTS =
    'find-all-cached-user-role-ref-endpoints';
  static CREATE_USER_ROLE = 'create-user-role';
  static REMOVE_USER_ROLE = 'remove-user-role';
  static FIND_USER_PROFILE_PHOTO_FOR_USER = 'find-user-profile-photo-for-user';
  static UPDATE_USER_PROFILE_IMAGE = 'update-user-profile-image-for-user';

  //swagger description
  static LOGIN_DESC =
    'Validates credentials. Returns signed JWT if successful. 401 otherwise. Updates last login time.';
  static FIND_USER_BY_USERNAME_DESC = 'Returns user given a username.';
  static FIND_USERS_BY_SEARCH_PARAMS_DESC =
    'Returns active users matching only the query string in the request. All other parameters are ignored. User profile info also returned.';
  static CREATE_USER_DESC = 'Registers a user.';
  static VALIDATE_TOKEN_DESC =
    'Provides a way for clients to see if their token is valid.';
  static FIND_USER_ROLE_REFS_FOR_USER_DESC =
    'Finds all active user role refs for the requesting user.';
  static FIND_ALL_CACHED_USER_ROLE_REFS_DESC =
    'Finds all active user role refs in the application that are cached.';
  static FIND_ALL_CACHED_USER_ROLE_REF_ENDPOINTS_DESC =
    'Finds all active user role ref endpoints in the application that are cached.';
  static FIND_ALL_USER_ROLES_HEAVY_BY_SEARCH_PARAMS_DESC =
    'Finds all active user roles matching search criteria. Returns user roles loaded with user, user profile and user role ref.';
  static CREATE_USER_ROLE_DESC =
    'Creates a user role for a user given a userId and userRoleRefId.';
  static REMOVE_USER_ROLE_DESC =
    'Deactivates the user role with the given user role ref id and user id.';
  static FIND_USER_PROFILE_PHOTO_FOR_USER_DESC =
    'Returns a base64 encoded string that represents the requesting users profile photo. This request can be cached by browser to improve performance.';
  static UPDATE_USER_PROFILE_IMAGE_DESC =
    'Updates the requesting user profile image.';

  //bcrypt
  static BCRYPT_SALT_ROUNDS = 10;

  //redis cache keys
  static APP_CACHE_USER_ROLE_REFS = 'APP_CACHE_USER_ROLE_REFS';
  static APP_CACHE_USER_ROLE_REF_ENDPOINTS =
    'APP_CACHE_USER_ROLE_REF_ENDPOINTS';
}
