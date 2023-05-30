import { Injectable } from '@nestjs/common';
import { User } from '../db/entities';
import { ImageGenerator, ImageReader } from '../image-processing';

/**
 * Base class for services that deal with a user. Provides handy method to hydrate user
 * with profile image.
 */
@Injectable()
export class ImageProcessingService {
  /**
   *
   * @param user
   * @returns - user with user profile photo
   */
  public async hydrateUserProfilePhoto(user: User) {
    user.password = '';

    const userProfile = await user.userProfile; //lazy load

    const profilePhotoPath = await ImageGenerator.generateImage(
      userProfile.profilePhotoPath,
      128,
    );
    if (profilePhotoPath) {
      const profilePhoto = await ImageReader.readImage(
        profilePhotoPath,
      );
      if (profilePhoto) {
        user.profilePhotoFile = profilePhoto;
      }
    }

    return user;
  }
}
