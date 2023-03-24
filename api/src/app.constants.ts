export class AppConstants {
  static appPort = process.env.REACT_APP_API_PORT || 3001;

  static appEnv: string = process.env.NODE_ENV || 'DEV';
  static appSecret: string = 'the world is a vampire';

  //endpoints
  static TEST: string = "test";
  static TEST_GET_USERS: string = "users";

  //swagger tags
  static SECURE: string = 'secure';

  //swagger description
  static TEST_USERS = "Returns users that are part of a test database.";  
}
