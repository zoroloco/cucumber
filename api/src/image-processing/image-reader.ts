import { Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import * as fs from 'fs';

export class ImageReader {
  /**
   * @param - imagePath
   * @return - a base 64 encoded string of the image contents. Empty string if
   * file does not exist.
   */
  public static async readImage(imagePath: string): Promise<string> {
    Logger.log('Reading image:' + imagePath);

    try {
      if (!existsSync(imagePath)) {
        Logger.error(
          'Cannot read image from file system. Image path does not exist:' +
            imagePath,
        );
        return '';
      }

      const imageContent = fs.readFileSync(imagePath);
      return Buffer.from(imageContent).toString('base64');
    } catch (error) {
      Logger.error('Error reading ' + imagePath + ':' + error);
    }

    return '';
  }
}
