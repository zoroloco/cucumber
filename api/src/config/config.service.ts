import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    if(fs.existsSync(filePath)){
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    }else{
      this.logger.warn('Did not find .env file. Using system envs instead');
    }
	
    this.logger.log('process.env.API_ISSUER_URL='+process.env.API_ISSUER_URL);
    this.logger.log('process.env.API_AUDIENCE='+process.env.API_AUDIENCE);
    this.logger.log('process.env.MYSQL_HOST='+process.env.MYSQL_HOST);
    this.logger.log('process.env.MYSQL_PORT='+process.env.MYSQL_PORT);
    this.logger.log('process.env.MYSQL_DATABASE='+process.env.MYSQL_DATABASE);
    this.logger.log('process.env.MYSQL_USER='+process.env.MYSQL_USER);
  }

  get(key: string): string {
	return this.envConfig[key];
  }
}