import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CustomSocket } from './socket/socket';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Conversation, UserI } from '../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: CustomSocket, private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000';

  // ChatService

joinRoom(userId: string) {
  this.socket.emit('joinRoom', userId);
}


//for send msg 
sendMessage(message: { senderId: string; receiverId: string; content: string }) {
  this.socket.emit('sendMessage', message);
}
//for recive msg 
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


//for unsend msg 
requestUnseenMessageCounts(userId: string) {
  this.socket.emit('requestUnseenMessageCounts', userId);
}

getUnseenMessageCounts(callback: (counts: any) => void) {
  this.socket.on('unseenMessageCounts', callback);
}


//for typing status
sendTypingStatus(data: { senderId: string; receiverId: string }) {
  this.socket.emit('typing', data);
}

sendStopTypingStatus(data: { senderId: string; receiverId: string }) {
  this.socket.emit('stopTyping', data);
}

onUserTyping(callback: (data: { senderId: string; typing: boolean }) => void) {
  this.socket.on('userTyping', callback);
}

//for status of msg 
getStatusUpdate(callback: (statusUpdate: { messageId: string; status: string }) => void) {
  this.socket.on('statusUpdate', callback);
}

//for update list 
getConversationUpdate(callback: (conversation: Conversation) => void) {
  this.socket.on('conversationUpdate', callback);
}

getConversations(userId: string): Observable<Conversation[]> {
  return this.http.get<Conversation[]>(`${this.apiUrl}/chat/${userId}`);
}


}