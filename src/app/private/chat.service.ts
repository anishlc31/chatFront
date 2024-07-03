import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CustomSocket } from './socket/socket';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserI } from '../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: CustomSocket, private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000';

  joinRoom(userId: string) {
    this.socket.emit('joinRoom', userId);
  }

  sendMessage(message: { senderId: string; receiverId: string; content: string }) {
    this.socket.emit('sendMessage', message);
  }

  receiveMessage(callback: (message: any) => void) {
    this.socket.on('receiveMessage', callback);
  }

  

  getMessages(user1Id: string, user2Id: string, skip: number, take: number): Observable<any[]> {
    return new Observable((observer) => {
      this.socket.emit('getMessages', { user1Id, user2Id, skip, take }, (messages: any[]) => {
        observer.next(messages);
        observer.complete();
      });
    });
  }



//unseen msg count 
  requestUnseenMessageCounts(userId: string) {
    this.socket.emit('requestUnseenMessageCounts', userId);
  }

  getUnseenMessageCounts(callback: (counts: any) => void) {
    this.socket.on('unseenMessageCounts', callback);
    }


  // Typing status
  sendTypingStatus(data: { senderId: string; receiverId: string }) {
    this.socket.emit('typing', data);
  }

  sendStopTypingStatus(data: { senderId: string; receiverId: string }) {
    this.socket.emit('stopTyping', data);
  }

  onUserTyping(callback: (data: { senderId: string; typing: boolean }) => void) {
    this.socket.on('userTyping', callback);
  }


  //for chat status

  getStatusUpdate(callback: (status: string) => void) {
    this.socket.on('statusUpdate', callback);
  }

}
