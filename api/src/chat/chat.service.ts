import {
  BadRequestException,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat, ChatMessage, UserChat, Message, User } from '../entities';
import { ImageProcessingService } from '../image-processing';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  @Inject(ImageProcessingService)
  private readonly imageProcessingService: ImageProcessingService;

  constructor(
    @InjectRepository(Chat, 'druidia')
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage, 'druidia')
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(UserChat, 'druidia')
    private readonly userChatRepository: Repository<UserChat>,
    @InjectRepository(Message, 'druidia')
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User, 'druidia')
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Given a chat id, will return all active users involved in the chat.
   *
   * @param chatId
   *
   */
  public async findAllUsersByChatId(chatId: number) {
    Logger.log('Attempting to find all active users for chat id:' + chatId);
    try {
      const userChats = await this.userChatRepository
        .createQueryBuilder('userChat')
        .leftJoinAndSelect('userChat.user', 'u')
        .where('userChat.inactivatedTime is null')
        .andWhere('userChat.chat.id = :chatId', { chatId })
        .andWhere('u.inactivatedTime is null')
        .getMany();

      if (userChats) {
        Logger.log(
          'Successfully found ' + userChats.length + ' for chat id:' + chatId,
        );

        const users = userChats.map((uc) => uc.user);

        //return friends;
        return await Promise.all(
          users.map(
            this.imageProcessingService.hydrateUserProfilePhoto.bind(this),
          ),
        );
      }
    } catch (error) {
      this.logger.error(
        'Error finding users by chat id:' + chatId + ' with error:' + error,
      );
      throw new BadRequestException(
        'Error encountered finding users for chat.',
      );
    }
  }

  /**
   *
   * @param userId
   *
   * @returns - list of active Chats for given user ID.
   */
  public async findAllChatsByUserId(userId: number) {
    Logger.log('Attempting to find all active chats for user id:' + userId);
    try {
      const userChats = await this.userChatRepository
        .createQueryBuilder('userChat')
        .leftJoin('userChat.user', 'u')
        .leftJoinAndSelect('userChat.chat', 'c')
        .where('userChat.inactivatedTime is null')
        .andWhere('u.id = :userId', { userId })
        .orderBy('userChat.createdTime')
        .getMany();

      if (userChats) {
        this.logger.log(
          'Successfully found:' +
            userChats.length +
            ' user chats for user ID:' +
            userId,
        );

        return userChats;
      }
    } catch (error) {
      this.logger.error(
        'Error finding user chats by user id:' +
          userId +
          ' with error:' +
          error,
      );
      throw new BadRequestException('Error encountered finding user chats.');
    }
  }

  /**
   * Create the chat to user association.  Create a chat object given the
   * list of user ids, name and publicFlag.
   *
   * @param reqUserId
   * @param name
   * @param userIds
   * @param publicFlag
   */
  public async createUserChat(
    reqUserId: number,
    name: string,
    userIds: Array<number>,
    publicFlag: boolean,
  ) {
    Logger.log(
      'Attempting to create a chat conversation with name:' +
        name +
        ' publicFlag:' +
        publicFlag +
        ' and user ids:' +
        JSON.stringify(userIds),
    );

    try {
      const chat = this.chatRepository.create();
      chat.setAuditFields(reqUserId);
      chat.name = name;
      chat.public = publicFlag;

      const savedChat = await this.chatRepository.save(chat);
      if (savedChat) {
        Logger.log('Successfully saved chat with id:' + savedChat.id);

        userIds.forEach(async (userId) => {
          const userChat = this.userChatRepository.create();
          userChat.chat = savedChat;
          userChat.user = this.userRepository.create();
          userChat.user.id = userId;

          userChat.setAuditFields(reqUserId);

          Logger.log('Saving user chat:' + JSON.stringify(userChat));

          this.userChatRepository.save(userChat); //async
        });

        return savedChat;
      }
    } catch (error) {
      this.logger.error(
        'Error creating new chat conversation with error:' + error,
      );
      throw new BadRequestException(
        'Error encountered creating chat conversation',
      );
    }
  }

  /**
   * Given a user ID and chat ID (usually from a user chat), will give back
   * a list of messages.
   *
   */
  public async findAllMessagesByUserIdChatId(userId: number, chatId: number) {}
}
