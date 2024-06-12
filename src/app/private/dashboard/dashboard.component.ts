import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

//  rooms$ = this.chatService.getMyRoom() 

title = this.chatService.getMessage()

  constructor( private chatService : ChatServiceService){}

  OnInit(){
  //  this.chatService.createRoom()
  }
}
