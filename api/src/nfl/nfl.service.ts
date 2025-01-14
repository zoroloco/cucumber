import {
  Injectable,
  Logger
} from '@nestjs/common';

@Injectable()
export class NflService {
  private readonly logger = new Logger(NflService.name);

  /**
   * findAllTeams
   *
   * @returns - all NFL team data.
   */
  public async findAllTeams() {
    Logger.log('Attempting to search all teams');
    return [];
  }
}
