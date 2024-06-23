import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/public/user.service';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users: UserI[] = [];
  selectedUser: UserI;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    }, (error) => {
      console.error('Error fetching users:', error);
    });
  }

  selectUser(user: UserI): void {
    this.selectedUser = user;
  }
}
