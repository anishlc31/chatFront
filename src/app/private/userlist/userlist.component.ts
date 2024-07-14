import { Conversation, UserI } from 'src/app/model/user.interface';
import { UserlistService } from './../userlist.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatService } from '../chat.service';
import { UserService } from 'src/app/public/user.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent {
  showSearchInput: boolean = false;
  @Input() selectedUser: UserI | null = null;
  @Input() users: UserI[] = [];
  @Input() typingStatus: { [key: string]: boolean } = {};
  @Output() userSelected = new EventEmitter<UserI>();

  currentUser: UserI | null = null;
  conversation: Conversation[] = [];
  unseenMessages: { [key: string]: number } = {};
  updateChatAtMap: { [key: string]: Date } = {};

  constructor(
    private userlistService: UserlistService,
    private webSocketService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userlistService.searchClicked$.subscribe(() => {
      this.showSearchInput = !this.showSearchInput;
    });

    this.currentUser = this.userService.getCurrentUser();

    if (this.currentUser) {
      this.userService.getAllUsers().subscribe((data) => {
        this.users = data.filter(user => user.id !== this.currentUser!.id);
        this.fetchAndSortConversations();
      });

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
        this.sortUsersByUpdateChatAt();
      });
    }
  }

  fetchAndSortConversations(): void {
    if (this.currentUser) {
      this.webSocketService.getConversations(this.currentUser.id).subscribe((conversations) => {
        conversations.forEach(conversation => {
          const userId = conversation.user1Id === this.currentUser!.id ? conversation.user2Id : conversation.user1Id;
          this.updateChatAtMap[userId] = conversation.updateChatAt;
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
