import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { UserI } from 'src/app/model/user.interface';
import { catchError, tap } from 'rxjs/operators';
import { LoginResponseI } from '../model/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }

 
  private apiUrl = 'http://localhost:3000/api/user'; // Adjust the port if necessary

  signup(user: UserI): Observable<UserI> {
    console.log(user.Username)
    return this.http.post<UserI>(`${this.apiUrl}/singup`, user).pipe(
      tap((createdUser: UserI) => this.snackbar.open(`User ${createdUser.Username} created successfully`, 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      })),
      catchError(e => {
        this.snackbar.open(`User could not be created, due to: ${e.error.message}`, 'Close', {
          duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
        })
        return throwError(e);
      })
    )
  }

  

  login(user: UserI): Observable<LoginResponseI> {
    return this.http.post<LoginResponseI>(`${this.apiUrl}/login`, user).pipe(
      tap((res: LoginResponseI) => localStorage.setItem('nestjs_chat_app', res.access_token)),
      tap(() => this.snackbar.open('Login Successfull', 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      }))
    );
  }

}
