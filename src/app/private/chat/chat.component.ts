import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../chat.service';
import { UserService } from 'src/app/public/user.service';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() selectedUser: UserI | null = null;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  users: UserI[] = [];
  messages: any[] = [];
  currentUser: UserI | null = null;
  newMessage: string = '';
  displayedMessagesCount: number = 25;
  unseenMessages: { [key: string]: number } = {}; 
  typingStatus: { [key: string]: boolean } = {}; 

  constructor(
    private webSocketService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
  
    if (this.currentUser) {
      this.userService.getAllUsers().subscribe((data) => {
        this.users = data.filter(user => user.id !== this.currentUser!.id);
      });
  
      this.webSocketService.joinRoom(this.currentUser.id);
  
      this.webSocketService.receiveMessage((message) => {
        if (message.receiverId === this.currentUser?.id) {
          if (message.senderId === this.selectedUser?.id) {
            this.messages.push(message);
            this.scrollToBottom();
          }
          this.updateUnseenMessages(message.senderId);
        }
      });

      this.webSocketService.updateMessageStatus((data) => {
        this.updateMessageStatus(data.messageId, data.status);
      });
  
      this.webSocketService.updateUserList((data) => {
        this.moveUserToTop(data.userId);
      });
  
      if (this.selectedUser) {
        this.loadMessagesForUser(this.selectedUser.id);
      }

      // Typing status
      this.webSocketService.onUserTyping((data) => {
        this.typingStatus[data.senderId] = data.typing;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'] && changes['selectedUser'].currentValue && this.currentUser) {
      this.messages = [];
      this.loadMessagesForUser(this.selectedUser!.id);
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedUser && this.currentUser) {
      const message = {
        senderId: this.currentUser.id,
        receiverId: this.selectedUser.id,
        content: this.newMessage.trim(),
        status: 'sent'
      };
      this.webSocketService.sendMessage(message);
      this.messages.push(message);
      this.webSocketService.sendStopTypingStatus({ senderId: this.currentUser.id, receiverId: this.selectedUser.id });
      this.newMessage = '';
      this.scrollToBottom();
      this.moveUserToTop(this.selectedUser.id);
    }
  }

  loadMessagesForUser(userId: string): void {
    if (this.currentUser) {
      this.webSocketService.getMessages(this.currentUser.id, userId, 0, this.displayedMessagesCount).subscribe((messages) => {
        this.messages = messages.reverse();
        this.scrollToBottom();
        this.unseenMessages[userId] = 0;
      });
    }
  }

  loadMoreMessages(): void {
    if (this.currentUser && this.selectedUser) {
      const skip = this.messages.length;
      const take = this.displayedMessagesCount;
      this.webSocketService.getMessages(this.currentUser.id, this.selectedUser.id, skip, take).subscribe((messages) => {
        this.messages = [...messages.reverse(), ...this.messages];
      });
    }
  }

  onUserSelect(user: UserI): void {
    this.selectedUser = user;
    this.messages = [];
    this.loadMessagesForUser(user.id);
  }

  private scrollToBottom(): void {
    if (this.messageContainer) {
      try {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Scroll to bottom failed', err);
      }
    }
  }

  private moveUserToTop(userId: string): void {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      const [user] = this.users.splice(userIndex, 1);
      this.users.unshift(user);
    }
  }



  private updateUnseenMessages(senderId: string): void {
    this.unseenMessages[senderId] = (this.unseenMessages[senderId] || 0) + 1;
  }

  private updateMessageStatus(messageId: string, status: string): void {
    const message = this.messages.find(msg => msg.id === messageId);
    if (message) {
      message.status = status;
    }
  }

  onMessageInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.trim()) {
      this.webSocketService.sendTypingStatus({ senderId: this.currentUser!.id, receiverId: this.selectedUser!.id });
    } else {
      this.webSocketService.sendStopTypingStatus({ senderId: this.currentUser!.id, receiverId: this.selectedUser!.id });
    }
  }
}