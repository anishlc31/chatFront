import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FriendshipService } from '../friendship.service';
import { Conversation, UserI } from 'src/app/model/user.interface';
import { UserService } from 'src/app/public/user.service';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-friendship',
  templateUrl: './friendship.component.html',
  styleUrls: ['./friendship.component.scss'],
})
export class FriendshipComponent implements OnInit {
  friendList: any[] = [];
 
  currentUser: UserI | null = null;


    showSearchInput: boolean = false;
    @Input() selectedUser: UserI | null = null;
    @Input() users: UserI[] = [];
  
    @Input() typingStatus: { [key: string]: boolean } = {};
    @Output() userSelected = new EventEmitter<UserI>();
  
    conversations: Conversation[] = [];
    unseenMessages: { [key: string]: number } = {};
    lastMessages: { [key: string]: string } = {};
    lastMessageTimes: { [key: string]: Date } = {};
    updateChatAtMap: { [key: string]: Date } = {};
  
  
   

  constructor(private friendshipService: FriendshipService,
     private userService: UserService,
         private webSocketService: ChatService,
     

  ) {}

  ngOnInit(): void {
   this.currentUser =  this.userService.getCurrentUser();

    if (this.currentUser) {
   
      this.fetchFriendList()

      this.webSocketService.getUnseenMessageCounts((counts: any) => {
        this.unseenMessages = counts;
      });

      this.webSocketService.requestUnseenMessageCounts(this.currentUser.id);

      this.webSocketService.onUserTyping((data) => {
        this.typingStatus[data.senderId] = data.typing;
      });

      this.webSocketService.getConversationUpdate((conversation) => {
        const userId = conversation.user1Id === this.currentUser!.id ? conversation.user2Id : conversation.user1Id;
        this.updateChatAtMap[userId] = conversation.updateChatAt;
        this.lastMessages[userId] = conversation.lastMessage;
        this.lastMessageTimes[userId] = conversation.lastMessageTime;
        this.sortUsersByUpdateChatAt();
      });
    }
  }

 
  fetchFriendList(): void {
    this.friendshipService.getFriendList().subscribe(
      (data) => {
        console.log('Raw friend list:', data); // Debug raw data
  
        // Process the friend list and exclude the current user
        this.friendList = data
          .filter((friend) => 
            friend.requester.id === this.currentUser!.id || friend.recipient.id === this.currentUser!.id
          )
          .map((friend) => 
            friend.requester.id === this.currentUser!.id ? friend.recipient : friend.requester
          );
  
        // Log the processed friend list for debugging
        console.log('Processed friend list:', this.friendList);
  
        // Fetch and sort conversations for these friends
        this.fetchAndSortConversations();
      },
      (error) => {
        console.error('Error fetching friend list:', error); // Debug error
      }
    );
  }
  
  


  fetchAndSortConversations(): void {
    if (this.currentUser) {
      this.webSocketService.getConversations(this.currentUser.id).subscribe((conversations) => {
        conversations.forEach(conversation => {
          const userId = conversation.user1Id === this.currentUser!.id ? conversation.user2Id : conversation.user1Id;
          this.updateChatAtMap[userId] = conversation.updateChatAt;
          this.lastMessages[userId] = conversation.lastMessage;
          this.lastMessageTimes[userId] = conversation.lastMessageTime;
        });
        this.sortUsersByUpdateChatAt();
      });
    }
  }

  sortUsersByUpdateChatAt(): void {
    this.users.sort((a, b) => {
      const aUpdate = this.updateChatAtMap[a.id!] || new Date(0);
      const bUpdate = this.updateChatAtMap[b.id!] || new Date(0);
      return new Date(bUpdate).getTime() - new Date(aUpdate).getTime();
    });
  }

  onUserSelect(user: UserI): void {
    this.userSelected.emit(user);
  }

}
