import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { UserService } from 'src/app/public/user.service';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() selectedUser: UserI | null = null;
  users: UserI[] = [];
  messages: any[] = [];
  currentUser: UserI | null = null;
  newMessage: string = '';

  constructor(
    private webSocketService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    console.log(this.currentUser);

    if (this.currentUser) {
      this.userService.getAllUsers().subscribe((data) => {
        this.users = data;
      });

      this.webSocketService.joinRoom(this.currentUser.id);

      this.webSocketService.receiveMessage((message) => {
        this.messages.push(message);
      });

      if (this.selectedUser) {
        this.loadMessagesForUser(this.selectedUser.id);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'] && changes['selectedUser'].currentValue && this.currentUser) {
      this.loadMessagesForUser(this.selectedUser!.id);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedUser && this.currentUser) {
      const message = {
        senderId: this.currentUser.id,
        receiverId: this.selectedUser.id,
        content: this.newMessage.trim()
      };
      this.webSocketService.sendMessage(message);
      this.messages.push(message);
      this.newMessage = '';
    }
  }

  loadMessagesForUser(userId: string): void {
    if (this.currentUser) {
      this.webSocketService.getMessages(this.currentUser.id, userId).subscribe((messages) => {
        this.messages = messages;
      });
    }
  }

  onUserSelect(user: UserI): void {
    this.selectedUser = user;
    this.loadMessagesForUser(user.id);
  }
}
