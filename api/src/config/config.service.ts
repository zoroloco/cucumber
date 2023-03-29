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
	
  }

  get(key: string): string {
	return this.envConfig[key];
  }
}