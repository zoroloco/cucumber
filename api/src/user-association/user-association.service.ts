import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserAssociation } from '../entities';
import { ImageProcessingService } from '../image-processing';

@Injectable()
export class UserAssociationService {
  private readonly logger = new Logger(UserAssociationService.name);

  @Inject(ImageProcessingService)
  private readonly imageProcessingService: ImageProcessingService;

  constructor(
    @InjectRepository(User, 'druidia')
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserAssociation, 'druidia')
    private readonly userAssociationRepository: Repository<UserAssociation>,
  ) {}

  /**
   * findUserAssociationsForUser
   *
   * @param reqUserId
   * @returns
   */
  public async findUserAssociationsForUser(reqUserId: number) {
    Logger.log('Attempting to find user associations for user id:' + reqUserId);
    try {
      const userAssociations = await this.userAssociationRepository
        .createQueryBuilder('ua')
        .leftJoin('ua.user', 'u')
        .leftJoinAndSelect('ua.associate', 'a')
        .where('ua.user.id = :userId', { reqUserId })
        .andWhere('ua.inactivatedTime is null')
        .andWhere('a.inactivatedTime is null') //don't get inactivated friends
        .orderBy('a.username')
        .getMany();

      if (userAssociations) {
        Logger.log(
          'Successfully found ' +
            userAssociations.length +
            ' user assocation(s).',
        );

        const friends = userAssociations.map((ua) => {
          return ua.associate;
        });

        //return friends;
        return await Promise.all(
          friends.map(
            this.imageProcessingService.hydrateUserProfilePhoto.bind(this),
          ),
        );
      }
    } catch (error) {
      Logger.error('Error finding user associations for user id:' + reqUserId);
      throw new BadRequestException(
        'Error encountered finding user associations.',
      );
    }
  }

  /**
   * createUserAssociation
   *
   * @param reqUserId
   * @param userId
   * @returns - the saved user assocation.
   */
  public async createUserAssocation(reqUserId: number, userId: number) {
    Logger.log(
      'Attempting to create association between userId:' +
        reqUserId +
        ' and associate userId:' +
        userId,
    );

    try {
      const userAssociation: UserAssociation =
        this.userAssociationRepository.create();
      userAssociation.user = await this.userRepository.findOne({
        where: { id: reqUserId },
      });
      userAssociation.associate = await this.userRepository.findOne({
        where: { id: userId },
      });
      userAssociation.setAuditFields(reqUserId);

      const savedUserAssociation = await this.userAssociationRepository.save(
        userAssociation,
      );
      Logger.log('Successfully linked users:' + reqUserId + ' and ' + userId);
      savedUserAssociation.user.password = '';
      savedUserAssociation.associate.password = '';
      return savedUserAssociation;
    } catch (error) {
      Logger.error(
        'Error creating association between userIds:' +
          reqUserId +
          ' and ' +
          userId +
          ' with error:' +
          error,
      );
      throw new BadRequestException(
        'Error encountered creating user association.',
      );
    }
  }

  /**
   * removeUserAssociation
   *
   * @param reqUserId
   * @param userId
   * @returns
   */
  public async removeUserAssociation(
    reqUserId: number,
    userId: number,
  ) {
    Logger.log(
      'Attempting to remove association between userId:' +
        reqUserId +
        ' and associate userId:' +
        userId,
    );

    try {
      let userAssociation = await this.userAssociationRepository
        .createQueryBuilder('ua')
        .leftJoin('ua.user', 'u')
        .leftJoinAndSelect('ua.associate', 'a')
        .where('ua.user.id = :reqUserId', { reqUserId })
        .andWhere('ua.associate.id = :userId', { userId })
        .andWhere('ua.inactivatedTime is null')
        .getOne();

      if (userAssociation) {
        Logger.log(
          'Successfully found user association to remove with id:' +
            userAssociation.id,
        );
        userAssociation.inactivatedBy = reqUserId;
        userAssociation.inactivatedTime = new Date();

        const savedUserAssociation = await this.userAssociationRepository.save(
          userAssociation,
        );
        Logger.log(
          'Successfully unlinked users:' + reqUserId + ' and ' + userId,
        );
        savedUserAssociation.associate.password = '';
        return savedUserAssociation;
      }
    } catch (error) {
      Logger.error(
        'Error removing association between userIds:' +
          reqUserId +
          ' and ' +
          userId +
          ' with error:' +
          error,
      );
      throw new BadRequestException(
        'Error encountered removing user association.',
      );
    }
  }
}
