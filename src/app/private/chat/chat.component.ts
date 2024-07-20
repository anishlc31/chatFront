import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../chat.service';
import { UserService } from 'src/app/public/user.service';
import { Conversation, UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() selectedUser: UserI | null = null;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  users: UserI[] = [];
  typingStatus: { [key: string]: boolean } = {}; 
  currentUser: UserI | null = null;
  conversation:Conversation[]=[]
  unseenMessages: { [key: string]: number } = {}; 
  updateChatAtMap: { [key: string]: Date } = {}; // New map to track updateChatAt
  messages: any[] = [];
  newMessage: string = '';
  displayedMessagesCount: number = 25;
  status : string =''


  constructor(
    private webSocketService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
  
    if (this.currentUser) {

  
      this.webSocketService.joinRoom(this.currentUser.id);
  
      this.webSocketService.receiveMessage((message) => {
        if (message.receiverId === this.currentUser?.id) {
          if (message.senderId === this.selectedUser?.id) {
            this.messages.push(message);
            this.scrollToBottom();
          }
        }
      });

      //chat status 

      this.webSocketService.getStatusUpdate((statusUpdate: { messageId: string; status: string }) => {
        const message = this.messages.find(msg => msg.id === statusUpdate.messageId);
        if (message) {
          message.status = statusUpdate.status;
        } else if (statusUpdate.status === 'SEEN') {
          this.messages.forEach(msg => {
            if (msg.senderId === this.currentUser?.id) {
              msg.status = 'SEEN';
            }
          });
        }
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
       status:'SENT'
      };

      this.webSocketService.sendMessage(message);
      this.messages.push(message);
      this.webSocketService.sendStopTypingStatus({ senderId: this.currentUser.id, receiverId: this.selectedUser.id });
      this.newMessage = '';
      this.scrollToBottom();
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



 

  onMessageInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.trim()) {
      this.webSocketService.sendTypingStatus({ senderId: this.currentUser!.id, receiverId: this.selectedUser!.id });
    } else {
      this.webSocketService.sendStopTypingStatus({ senderId: this.currentUser!.id, receiverId: this.selectedUser!.id });
    }
  }

  


  
}