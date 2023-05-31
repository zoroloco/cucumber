import { Global, Module } from '@nestjs/common';
import { ImageProcessingService } from '.';

@Global()
@Module({
  providers: [ImageProcessingService],
  exports: [ImageProcessingService],
})
export class ImageProcessingModule {}
