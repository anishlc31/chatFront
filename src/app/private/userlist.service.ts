import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserlistService {

  private searchClicked = new Subject<void>();

  searchClicked$ = this.searchClicked.asObservable();

  triggerSearchClick() {
    this.searchClicked.next();
  }}
