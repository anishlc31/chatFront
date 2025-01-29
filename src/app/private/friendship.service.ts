import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { CustomSocket } from './socket/socket';

@Injectable({
  providedIn: 'root',
})
export class FriendshipService {
  private apiUrl = 'http://localhost:3000/friendship'; // Update with your API URL

  constructor(private http: HttpClient , private socket: CustomSocket) {
    this.listenForNotifications();
    this.loadInitialNotificationCount();


  }

  sendFriendRequest(recipientId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, { recipientId });
  }

  updateFriendshipStatus(
    requesterId: string,
    recipientId: string,
    status: string
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-status`, {
      requesterId,
      recipientId,
      status,
    });
  }

  // getFriendList(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/list`);
  // }

  getFriendList(): Observable<any> {
    console.log('Fetching friend list...'); // Log request
    return this.http.get<any[]>(`${this.apiUrl}/list`).pipe(
      tap((data) => console.log('Friend list received:', data)),
      catchError((error) => {
        console.error('Error fetching friend list:', error);
        return throwError(error);
      })
    );
  }
  

  getPendingRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending-requests`);
  }

  getExcludedUserIds(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/excluded-users`);
  }

  

  // Reset notifications for a user
  resetNotifications(userId: string) {
    this.socket.emit('resetNotificationCount', userId);
  }


  private notificationCount = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCount.asObservable();


  
  
  // Listen for notification updates
  private listenForNotifications() {
    this.socket.on('notificationCount', (count: number) => {
      this.notificationCount.next(count);
      this.saveNotificationCountToLocalStorage(count); // Save to local storage

    });
  }


  private saveNotificationCountToLocalStorage(count: number): void {
    localStorage.setItem('notificationCount', count.toString());
  }


  private loadInitialNotificationCount(): void {
    const savedCount = localStorage.getItem('notificationCount');
    if (savedCount !== null) {
      this.notificationCount.next(parseInt(savedCount, 10));
    }
  }



}
