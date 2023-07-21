import {
  BadRequestException,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat, ChatMessage, ChatUser, User } from '../entities';
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
    @InjectRepository(ChatUser, 'druidia')
    private readonly chatUserRepository: Repository<ChatUser>,
    @InjectRepository(User, 'druidia')
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   *
   * @param userId
   *
   * @returns - list of active Chats for given user ID. The chats will contain a list of chatUsers
   * associated to the chat. Each chatUser will have their user object populated with user profile photo.
   */
  public async findAllChatsByUserId(userId: number) {
    Logger.log('Attempting to find all active chats for user id:' + userId);
    try {
      const chatUsers = await this.chatUserRepository
        .createQueryBuilder('chatUser')
        .leftJoinAndSelect('chatUser.chat', 'chat')
        .where('chatUser.user.id = :userId', { userId })
        .andWhere('chatUser.inactivatedTime is null')
        .andWhere('chat.inactivatedTime is null')
        .getMany();

      if (chatUsers) {
        this.logger.log(
          'Successfully retreived:' +
            chatUsers.length +
            ' chat user entries for user id:' +
            userId,
        );

        // Extract chatIds from chatUsers
        const chatIds = chatUsers.map((chatUser) => chatUser.chat.id);

        // Retrieve chats and their associated chatUsers
        const chats = await this.chatRepository
          .createQueryBuilder('chat')
          .leftJoinAndSelect('chat.chatUsers', 'chatUsers')
          .where('chat.id IN (:...chatIds)', {
            chatIds: chatIds.length > 0 ? chatIds : [null],
          })
          .getMany();

        if(chats){
          this.logger.log('Successfully mapped:'+chats.length+' chats.');
          return await Promise.all(chats.map(this.hydrateChats.bind(this)));
        }
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

  private async hydrateChats(chat:Chat){
    this.logger.log('Now hydrating chat:'+JSON.stringify(chat));    
    chat.chatUsers = await Promise.all(chat.chatUsers.map(this.hydrateChatUsers.bind(this)));
    return chat;
  }

  private async hydrateChatUsers(chatUser:ChatUser){
    this.logger.log('Now hydrating chat user:'+JSON.stringify(chatUser));
    let user = await chatUser.user;//lazy load
    user = await this.imageProcessingService.hydrateUserProfilePhoto(user);
    chatUser.user = user;
    return chatUser;
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
          const userChat = this.chatUserRepository.create();
          userChat.chat = savedChat;
          userChat.user = this.userRepository.create();
          userChat.user.id = userId;

          userChat.setAuditFields(reqUserId);

          Logger.log('Saving user chat:' + JSON.stringify(userChat));

          this.chatUserRepository.save(userChat); //async
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
}
