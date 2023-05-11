import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities';
import { ImageGeneratorService, ImageReaderService } from '../common';

/**
 * Base class for services that deal with a user. Provides handy method to hydrate user
 * with profile image.
 */
@Injectable()
export class UserCommonService {
  constructor(    
  ) {}

  @Inject(ImageGeneratorService)
  private readonly imageGeneratorService: ImageGeneratorService;

  @Inject(ImageReaderService)
  private readonly imageReaderService: ImageReaderService;

  /**
   *
   * @param user
   * @returns - user with user profile photo
   */
  protected async hydrateUser(user: User) {
    user.password = '';

    const userProfile = await user.userProfile; //lazy load

    const profilePhotoPath = await this.imageGeneratorService.generateImage(
      userProfile.profilePhotoPath,
      128,
    );
    if (profilePhotoPath) {
      const profilePhoto = await this.imageReaderService.readImage(
        profilePhotoPath,
      );
      if (profilePhoto) {
        user.profilePhotoFile = profilePhoto;
      }
    }

    return user;
  }
}
