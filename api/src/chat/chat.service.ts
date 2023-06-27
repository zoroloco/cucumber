import {
  BadRequestException,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat, ChatMessage, UserChat, Message, User } from '../entities';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

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
   *
   * @param userId
   *
   * @returns - list of active Chats for given user ID.
   */
  public async findAllChatByUserId(userId: number) {
    Logger.log('Attempting to find all active chats for user id:' + userId);
    try {
      const userChats = await this.userChatRepository
        .createQueryBuilder('userChat')
        .leftJoin('userChat.user', 'u')
        .where('userChat.inactivatedTime is null')
        .andWhere('u.id = :userId', { userId })
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
      throw new BadRequestException('Error finding user chats.');
    }
  }

  /**
   * Create the chat to user association.  Create a chat object given the
   * list of user ids.
   * 
   * @param reqUserId 
   * @param name 
   * @param userIds 
   */
  public async createUserChat(reqUserId: number, name: string, userIds: Array<number>) {
    Logger.log(
      'Attempting to create a chat conversation with name:' +
        name +
        ' and user ids:' +
        JSON.stringify(userIds),
    );

    try {
        const chat = this.chatRepository.create();
        chat.setAuditFields(reqUserId);
        chat.name = name;
        
        const savedChat = await this.chatRepository.save(chat);
        if(savedChat){
            Logger.log('Successfully saved chat with id:'+savedChat.id);

            userIds.forEach(async (userId)=>{
                const userChat = this.userChatRepository.create();
                userChat.chat = savedChat;
                userChat.user = this.userRepository.create();
                userChat.user.id = userId;

                userChat.setAuditFields(reqUserId);

                Logger.log('Saving user chat:'+JSON.stringify(userChat));

                this.userChatRepository.save(userChat);//async
            });

            return savedChat;
        }

    } catch (error) {
      this.logger.error(
        'Error creating new chat conversation with error:' + error,
      );
      throw new BadRequestException('Error creating chat conversation');
    }
  }

  /**
   * Given a user ID and chat ID (usually from a user chat), will give back 
   * a list of messages.
   * 
   */
  public async findAllMessagesByUserIdChatId(userId:number, chatId:number){

  }
}
