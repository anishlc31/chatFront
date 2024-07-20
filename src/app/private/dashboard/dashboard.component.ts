import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/public/user.service';
import { UserI } from 'src/app/model/user.interface';
import { UserlistService } from '../userlist.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  {
  users: UserI[] = [];
  selectedUser: UserI | null = null;

  constructor(private userService: UserService , private userlistservice : UserlistService) { }

  onSearchClick() {
    this.userlistservice.triggerSearchClick();
  }



  onUserSelected(user: UserI): void {
    this.selectedUser = user;    
  }

}
