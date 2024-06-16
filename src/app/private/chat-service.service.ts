import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RoomI, RoomPaginateI } from '../model/room.interface';
import { UserI } from '../model/user.interface';
import { CustomSocket } from './socket/socket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  constructor(private socket : CustomSocket) { }

  sendMessage(){

  }


   getMessage(){
return this.socket.fromEvent('message')
   }

   getMyRoom(){

    return this.socket.fromEvent<RoomPaginateI>('rooms')

   }

   getRooms(): Observable<any> {
    return this.socket.fromEvent('rooms');
  }

  createRoom(room: { name: string; description: string }) {
    this.socket.emit('createRoom', { data: room });
  }

  onError(): Observable<any> {
    return this.socket.fromEvent('Error');
  }

  


}