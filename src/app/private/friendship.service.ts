import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FriendshipService {
  private apiUrl = 'http://localhost:3000/friendship'; // Update with your API URL

  constructor(private http: HttpClient) {}

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

  getFriendList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  getPendingRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending-requests`);
  }
}
