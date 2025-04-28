import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserI } from 'src/app/model/user.interface';
import { UserService } from 'src/app/public/user.service';
import { Location } from '@angular/common'; // <-- Added Location for back button

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  constructor(private userService: UserService, private location: Location) {}

  @Input() users: UserI[] = [];
  @Output() userSelected = new EventEmitter<UserI>();
  currentUser: UserI | null = null;
  errorMessage: string = '';
  @Output() showSearchChange = new EventEmitter<boolean>(); 
  @Input() showSearch: boolean = false;
  @Input() selectedUser: UserI | null = null;




  searchQuery: string = '';
  showSuggestions: boolean = false;

  filteredUsers: UserI[] = []; // <-- Added for filtering

  ngOnInit(): void {
    this.loadAllUsers();
  }

  private loadAllUsers(): void {
    this.currentUser = this.userService.getCurrentUser(); 

    if (this.currentUser) {
      this.userService.getAllUsers().subscribe({
        next: (allUsers) => {
          this.users = allUsers.filter(user => user.id !== this.currentUser?.id);
          this.filteredUsers = [...this.users]; // <-- Initially show all users
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to load users.';
        }
      });
    }
  }

  selectUser(user: UserI): void {
   this.showSearchChange.emit(false); // Hide search
    this.userSelected.emit(user); // Emit user to dashboard
  }
  

  toggleSearch(): void {
    this.showSuggestions = !this.showSuggestions;
  }

  filterUsers(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(query)
    );
  }

  goBack(): void {
    this.showSearchChange.emit(false);
  }
}
