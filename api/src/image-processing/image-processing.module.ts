import { Module } from '@nestjs/common';
import { ImageProcessingService } from '.';

@Module({
  providers: [ImageProcessingService],
  exports: [ImageProcessingService],
})
export class ImageProcessingModule {}
