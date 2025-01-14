import { Module } from '@nestjs/common';
import { AuthUserRoleGuard } from '../auth';
import { NflController } from './nfl.controller';
import { NflService } from './nfl.service';

@Module({
  imports: [],
  providers: [NflService, AuthUserRoleGuard],
  controllers: [NflController],
  exports: [NflService],
})
export class NflModule {}
