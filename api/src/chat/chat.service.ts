import {
  BadRequestException,
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
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
   * @param skinnyFlag - if true then no profile photos hydrated with user profile.
   *
   * @returns - list of active Chats for given user ID. The chats will contain a list of chatUsers
   * associated to the chat. Each chatUser will have their user object populated with user profile photo.
   */
  public async findChatsForUser(reqUserId: number, skinnyFlag: boolean) {
    Logger.log('Attempting to find all active chats for user id:' + reqUserId+' skinnyFlag:'+skinnyFlag);
    try {
      const chatUsers = await this.chatUserRepository
        .createQueryBuilder('chatUser')
        .leftJoinAndSelect('chatUser.chat', 'chat')
        .where('chatUser.user.id = :reqUserId', { reqUserId })
        .andWhere('chatUser.inactivatedTime is null')
        .andWhere('chat.inactivatedTime is null')
        .getMany();

      if (chatUsers) {
        this.logger.log(
          'Successfully retreived:' +
            chatUsers.length +
            ' chat user entries for user id:' +
            reqUserId,
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

        if (chats) {          
          this.logger.log('Successfully mapped:' + chats.length + ' chats.');
          if(!skinnyFlag){
            return await Promise.all(chats.map(this.hydrateChats.bind(this)));
          }else{
            return await Promise.all(chats.map(this.hydrateChatsSkinny.bind(this)));
          }
        }
      }
    } catch (error) {
      this.logger.error(
        'Error finding user chats by user id:' +
          reqUserId +
          ' with error:' +
          error,
      );
      throw new BadRequestException('Error encountered finding user chats.');
    }
  }

  private async hydrateChatsSkinny(chat: Chat) {
    this.logger.log('Now hydrating skinny chat:' + JSON.stringify(chat));
    chat.chatUsers = await Promise.all(
      chat.chatUsers.map(this.hydrateChatUsersSkinny.bind(this)),
    );
    return chat;
  }

  private async hydrateChats(chat: Chat) {
    this.logger.log('Now hydrating chat:' + JSON.stringify(chat));
    chat.chatUsers = await Promise.all(
      chat.chatUsers.map(this.hydrateChatUsers.bind(this)),
    );
    return chat;
  }

  private async hydrateChatUsers(chatUser: ChatUser) {
    this.logger.log('Now hydrating chat user:' + JSON.stringify(chatUser));
    let user = await chatUser.user; //lazy load
    user = await this.imageProcessingService.hydrateUserProfilePhoto(user);
    user.password = '';
    chatUser.user = user;    
    return chatUser;
  }

  private async hydrateChatUsersSkinny(chatUser: ChatUser) {
    this.logger.log('Now hydrating skinny chat user:' + JSON.stringify(chatUser));
    let user = await chatUser.user; //lazy load    
    user.password = '';
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
  public async createChat(
    reqUserId: number,
    name: string,
    userIds: Array<number>,
    publicFlag: boolean,
  ) {
    Logger.log(
      'Attempting to create a chat conversation with name:' +
        name +
        ' for user id:' +
        reqUserId +
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

        //add yourself to the chat
        userIds.push(reqUserId);

        userIds.forEach(async (userId) => {
          const chatUser = this.chatUserRepository.create();
          chatUser.chat = savedChat;

          const user = this.userRepository.create();
          user.id = userId;
          chatUser.user = user;

          chatUser.setAuditFields(reqUserId);

          Logger.log('Saving chat user:' + JSON.stringify(chatUser));

          this.chatUserRepository.save(chatUser); //async
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
   * Creates a chat message for the requester user id and given chat id.
   *
   * @param reqUserId
   * @param chatId
   * @param content
   */
  public async createChatMessage(
    reqUserId: number,
    chatId: number,
    content: string,
  ) {
    Logger.log(
      'Attempting to create a chat message for:' +
        reqUserId +
        ' and chat id:' +
        chatId +
        ' with content:' +
        content,
    );

    try {
      const chatMessage = this.chatMessageRepository.create();
      chatMessage.setAuditFields(reqUserId);

      const chat = this.chatRepository.create();
      chat.id = chatId;
      chatMessage.chat = chat;

      const user = this.userRepository.create();
      user.id = reqUserId;
      chatMessage.user = user;

      chatMessage.content = content;

      const savedChatMessage = await this.chatMessageRepository.save(
        chatMessage,
      );
      if (savedChatMessage) {
        Logger.log(
          'Successfully saved chat message with id:' + savedChatMessage.id,
        );
        return savedChatMessage;
      }
    } catch (error) {
      this.logger.error('Error creating new chat message with error:' + error);
      throw new BadRequestException('Error encountered creating chat message.');
    }
  }

  /**
   * @param reqUserId
   * @param chatId
   *
   * @returns - list of chat messages for the given chat id. Validation is done to make sure
   * the requestor's user id is involved in the chat.
   */
  public async findAllChatMessagesByChatId(reqUserId: number, chatId: number) {
    Logger.log(
      'Attempting to find all active chat messages for chat id:' +
        chatId +
        ' for user id:' +
        reqUserId,
    );
    try {
      const chatMessages = await this.chatMessageRepository
        .createQueryBuilder('chatMessage')
        .leftJoinAndSelect('chatMessage.chat', 'chat')
        .where('chatMessage.chat.id = :chatId', { chatId })
        .andWhere('chatMessage.inactivatedTime is null')
        .andWhere('chat.inactivatedTime is null')
        .getMany();

      if (chatMessages) {
        this.logger.log(
          'Successfully found:' +
            chatMessages.length +
            ' chat messages for chat id:' +
            chatId,
        );

        // Retrieve chats and their associated chatUsers
        const chat = await this.chatRepository
          .createQueryBuilder('chat')
          .leftJoinAndSelect('chat.chatUsers', 'chatUsers')
          .where('chat.id = :chatId', { chatId })
          .getOne();

        if (chat && chat.chatUsers.filter((cu) => cu.user.id === reqUserId)) {
          this.logger.log(
            'Successfully populated chat for chat messages and this user is part of the chat.',
          );
          return chatMessages;
        }

        return new UnauthorizedException(
          'Error encountered finding chat messages.',
        );
      }
    } catch (error) {
      this.logger.error(
        'Error finding chats messages by chat id:' +
          chatId +
          ' with error:' +
          error,
      );
      throw new BadRequestException('Error encountered finding chat messages.');
    }
  }
}
