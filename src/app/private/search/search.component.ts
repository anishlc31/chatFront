import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserI } from 'src/app/model/user.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Input() users: UserI[] = [];
  @Output() userSelected = new EventEmitter<UserI>();

  searchQuery: string = '';
  showSuggestions: boolean = false;
  
  get filteredUsers(): UserI[] {
    return this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectUser(user: UserI): void {
    this.userSelected.emit(user);
    this.searchQuery = '';
    this.showSuggestions = false;
  }

  toggleSearch(): void {
    this.showSuggestions = !this.showSuggestions;
  }
}
