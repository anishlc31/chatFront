// import { Component, OnInit } from '@angular/core';
// import { ChatServiceService } from '../chat-service.service';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss']
// })
// export class DashboardComponent {

//  rooms$ = this.chatService.getMyRoom() 


//   constructor( private chatService : ChatServiceService){}

//   OnInit(){
//     this.chatService.createRoom()
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  rooms: any[] = [];
  roomForm: FormGroup;

  constructor(private chatService: ChatServiceService, private fb: FormBuilder) {
    this.roomForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.chatService.getRooms().subscribe((rooms: any) => {
      this.rooms = rooms.items;
    });

    this.chatService.onError().subscribe((error: any) => {
      console.error('Error:', error);
    });
  }

  createRoom() {
    if (this.roomForm.valid) {
      this.chatService.createRoom(this.roomForm.value);
      this.roomForm.reset();
    }
  }
}

