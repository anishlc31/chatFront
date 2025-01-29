import { Component, Input } from '@angular/core';
import { UserI } from 'src/app/model/user.interface';
import { UserlistService } from './../userlist.service';
import { UserService } from 'src/app/public/user.service';
import { FriendshipService } from '../friendship.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent {
  showSearchInput: boolean = false;
  @Input() selectedUser: UserI | null = null;
  @Input() users: UserI[] = [];
  currentUser: UserI | null = null;
  friendList: any[] = [];
  pendingRequests: any[] = [];
  //recipientId: string = '';
  errorMessage: string = '';


  constructor(
    private userlistService: UserlistService,
    private userService: UserService,
    private friendshipService: FriendshipService
  ) {}

  ngOnInit() {
      this.getPendingRequests();
    this.userlistService.searchClicked$.subscribe(() => {
      this.showSearchInput = !this.showSearchInput;
    });

    this.loadUsers();
  }
  private loadUsers(): void {
    this.currentUser = this.userService.getCurrentUser(); // Get the current user details
  
    if (this.currentUser) {
      // Fetch excluded user IDs
      this.friendshipService.getExcludedUserIds().subscribe((excludedIds) => {
        // Fetch all users
        this.userService.getAllUsers().subscribe((allUsers) => {
          // Filter out excluded users and the current user
          this.users = allUsers.filter(
            (user) => !excludedIds.includes(user.id) && user.id !== this.currentUser.id
          );
          console.log('Filtered Users:', this.users); // Debugging log
        });
      });
    }
  }
  


  getPendingRequests(): void {
    this.friendshipService.getPendingRequests().subscribe({
      next: (data) => (this.pendingRequests = data),
      error: (err) => console.error(err),
    });
  }
  sendRequest(recipientId: string): void {
    if (!recipientId) {
      this.errorMessage = 'Recipient ID is required.';
      return;
    }

    this.friendshipService.sendFriendRequest(recipientId).subscribe({
      next: () => {
        this.errorMessage = '';
      //  this.getPendingRequests();
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
