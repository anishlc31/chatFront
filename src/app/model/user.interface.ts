export interface UserI {
    id?: string;
    email?: string;
    username?: string;
    password?: string;
  
  }



  export interface Conversation {
    lastMessageSenderId: string;
    id?: string;
    user1Id: string;
    user2Id: string;
    unseenMessageCountOfUser1: number;
    unseenMessageCountOfUser2: number;
    createdAt: Date;
    updatedAt: Date;
    updateChatAt: Date;
    lastMessage?: string;
    lastMessageTime?: Date;
    lastMessageSenderUsername?: string;
  }
  
  