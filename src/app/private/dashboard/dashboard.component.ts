import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/public/user.service';
import { UserI } from 'src/app/model/user.interface';
import { UserlistService } from '../userlist.service';
import { FriendshipService } from '../friendship.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users: UserI[] = [];
  selectedUser: UserI | null = null;
  showUserList: boolean = false; // State for displaying the userlist
  currentUser: UserI | null = null;
  notificationCount: number = 0;

  constructor(
    private userService: UserService, 
    private userlistservice: UserlistService,
    private friendshipService: FriendshipService
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser(); // Get the current user details

    // Load initial count from local storage
    this.loadNotificationCountFromLocalStorage();

    // Subscribe to real-time notification count updates
    this.friendshipService.notificationCount$.subscribe((count) => {
      console.log("Notification Count Updated:", count);
      this.notificationCount = count;
      this.saveNotificationCountToLocalStorage(count);
    });
  }

  // Save notification count to local storage
  private saveNotificationCountToLocalStorage(count: number): void {
    localStorage.setItem('notificationCount', count.toString());
  }

  // Load notification count from local storage
  private loadNotificationCountFromLocalStorage(): void {
    const savedCount = localStorage.getItem('notificationCount');
    if (savedCount !== null) {
      this.notificationCount = parseInt(savedCount, 10);
    }
  }

  // Reset notifications when the friend list is opened
  resetNotifications() {
    if (this.currentUser) {
      this.friendshipService.resetNotifications(this.currentUser.id);
      this.notificationCount = 0; // Reset the count in UI
      this.saveNotificationCountToLocalStorage(0); // Update local storage
    }
  }

  onSearchClick() {
    this.userlistservice.triggerSearchClick();
  }

  onAddFriendClick() {
    this.showUserList = !this.showUserList; // Toggle userlist visibility
    this.resetNotifications(); // Reset notifications when opening the friend list
  }

  onUserSelected(user: UserI): void {
    this.selectedUser = user;
    this.showUserList = false; // Hide userlist after selecting a user
  }
}
