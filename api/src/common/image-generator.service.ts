import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp = require('sharp');
import { User } from '../db/entities';

@Injectable()
export class ImageGeneratorService {
  /**
   * @param - imageFileName - filename example: mydogphoto.jpg
   * @param - width - width of image path to fetch or create.
   *
   * @return - string with file path of the image you want in its size
   */
  public async generateImage(
    imagePath: string,
    width: number,
  ): Promise<string> {
    Logger.log('Generating image:' + imagePath);

    try {
      const [fileBaseName, fileType] = imagePath.split('.');

      const basePath = join('uploads', imagePath);
      const targetPath = join(
        'uploads',
        `${fileBaseName}_${width}.${fileType}`,
      );

      Logger.log('basePath:' + basePath); //original
      Logger.log('targetPath:' + targetPath); //new

      //if doesn't exist, then scale and save it
      if (!existsSync(targetPath)) {
        if (!existsSync(basePath)) {
          Logger.error(basePath + ' does not exist.');
          return null;
        }

        Logger.log('Resizing image:' + basePath.toString());
        await sharp(basePath.toString())
          .resize(+width)
          .toFile(targetPath.toString());
        Logger.log('Successfully resized image to:' + targetPath.toString());
      }

      Logger.log('Target Path already exists. No resize necessary.');
      return targetPath;
    } catch (error) {
      Logger.error('Error generating image:' + error);
    }

    return null;
  }
}
