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
  static FIND_ALL_USER_ROLES_HEAVY_BY_SEARCH_PARAMS: string =
    'find-all-user-roles-heavy-by-search-params';
  static FIND_USER_BY_USERNAME = 'find-user-by-username';
  static FIND_USERS_BY_SEARCH_PARAMS = 'find-users-by-search-params';
  static CREATE_USER = 'create-user';
  static LOGIN: string = 'login';
  static VALIDATE_TOKEN: string = 'validate-token';
  static FIND_USER_ASSOCIATIONS_BY_USER =
    'find-user-associations-by-user';
  static CREATE_USER_ASSOCIATION = 'create-user-association';
  static REMOVE_USER_ASSOCIATION = 'remove-user-association';
  static FIND_USER_ROLE_REFS_BY_USER = 'find-user-role-refs-by-user-id/:userid';
  static FIND_ALL_CACHED_USER_ROLE_REFS = 'find-all-cached-user-role-refs';
  static FIND_ALL_CACHED_USER_ROLE_REF_ENDPOINTS =
    'find-all-cached-user-role-ref-endpoints';
  static CREATE_USER_ROLE = 'create-user-role';
  static REMOVE_USER_ROLE = 'remove-user-role';
  static CREATE_CHAT = 'create-chat';
  static FIND_CHATS_FOR_USER = 'find-chats-for-user';
  static CREATE_CHAT_MESSAGE = 'create-chat-message';
  static FIND_CHAT_MESSAGES_BY_CHAT = 'find-chat-messages-by-chat-id/:chatid';
  static FIND_USER_PROFILE_PHOTO_FOR_USER = 'find-user-profile-photo-for-user';

  //swagger description
  static LOGIN_DESC =
    'Validates credentials. Returns signed JWT if successful. 401 otherwise. Updates last login time.';
  static FIND_ALL_USERS_DESC =
    'Returns all active users. With user profile info.';
  static FIND_USER_BY_USERNAME_DESC = 'Returns user given a username.';
  static FIND_USERS_BY_SEARCH_PARAMS_DESC =
    'Returns active users matching only the query string in the request. All other parameters are ignored. User profile info also returned.';
  static CREATE_USER_DESC = 'Registers a user.';
  static VALIDATE_TOKEN_DESC =
    'Provides a way for clients to see if their token is valid.';
  static FIND_USER_ASSOCIATIONS_BY_USER_DESC =
    'Returns all active user associations for the requesting user. This is the friend list.';
  static CREATE_USER_ASSOCIATION_DESC =
    'Will create an assocation between the user requesting and the given user id(will you be my frend?).';
  static REMOVE_USER_ASSOCIATION_DESC =
    'Deactivates the assocation between the requesting user and the given user id(leave me alone!).';
  static FIND_USER_ROLE_REFS_BY_USER_DESC =
    'Finds all active user role refs for a given user id.';
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
  static CREATE_CHAT_DESC =
    'Creates a chat conversation for the requesting user and given user ids.';
  static FIND_CHATS_FOR_USER_DESC =
    'Finds all active chats for the user requesting. Also returns the list of chat users associated to the chat. Each chat user will have its user populated with user profile and profile photo.';
  static CREATE_CHAT_MESSAGE_DESC =
    'Creates a chat message for the user requesting and chat id.';
  static FIND_CHAT_MESSAGES_BY_CHAT_DESC =
    'Finds all active chat messages given the chat id. Validation done to make sure request user id is part of the chat.';
  static FIND_USER_PROFILE_PHOTO_FOR_USER_DESC = 'Returns a base64 encoded string that represents the requesting users profile photo. This request can be cached by browser to improve performance.';

  //bcrypt
  static BCRYPT_SALT_ROUNDS = 10;

  //redis cache keys
  static APP_CACHE_USER_ROLE_REFS = 'APP_CACHE_USER_ROLE_REFS';
  static APP_CACHE_USER_ROLE_REF_ENDPOINTS =
    'APP_CACHE_USER_ROLE_REF_ENDPOINTS';
}
