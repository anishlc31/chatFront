import { Component, OnInit } from '@angular/core';
import { FriendshipService } from '../friendship.service';
import { UserI } from 'src/app/model/user.interface';
import { UserService } from 'src/app/public/user.service';

@Component({
  selector: 'app-friendship',
  templateUrl: './friendship.component.html',
  styleUrls: ['./friendship.component.scss'],
})
export class FriendshipComponent implements OnInit {
  friendList: any[] = [];
  pendingRequests: any[] = [];
  recipientId: string = '';
  errorMessage: string = '';
  currentUser: UserI | null = null;

  constructor(private friendshipService: FriendshipService, private userService: UserService
  ) {}

  ngOnInit(): void {
   this.currentUser =  this.userService.getCurrentUser();
   console.log("hello"+this.currentUser.id)
    this.getFriends();
    this.getPendingRequests();
  }

  getFriends(): void {
    this.friendshipService.getFriendList().subscribe({
      next: (data) => (this.friendList = data),
      error: (err) => console.error(err),
    });
  }

  getPendingRequests(): void {
    this.friendshipService.getPendingRequests().subscribe({
      next: (data) => (this.pendingRequests = data),
      error: (err) => console.error(err),
    });
  }

  sendRequest(): void {
    if (!this.recipientId) {
      this.errorMessage = 'Recipient ID is required.';
      return;
    }

    this.friendshipService.sendFriendRequest(this.recipientId).subscribe({
      next: () => {
        this.errorMessage = '';
        this.getPendingRequests();
        alert('Friend request sent!');
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'An error occurred.';
      },
    });
  }

  acceptRequest(requesterId: string): void {
    this.friendshipService
      .updateFriendshipStatus(requesterId,  this.currentUser.id , 'ACCEPTED') // Replace 'currentUserId' with the actual user ID
      .subscribe({
        next: () => {
          this.getFriends();
          this.getPendingRequests();
          alert('Friend request accepted!');
        },
        error: (err) => console.error(err),
      });
  }

  rejectRequest(requesterId: string): void {
    this.friendshipService
      .updateFriendshipStatus(requesterId, this.currentUser.id, 'REJECTED') // Replace 'currentUserId' with the actual user ID
      .subscribe({
        next: () => {
          this.getPendingRequests();
          alert('Friend request rejected!');
        },
        error: (err) => console.error(err),
      });
  }
}
