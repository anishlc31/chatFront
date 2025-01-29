import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserI } from 'src/app/model/user.interface';
import { LoginResponseI } from '../model/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/auth'; 

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private jwtService: JwtHelperService
  ) {}

  signup(user: UserI): Observable<UserI> {
    return this.http.post<UserI>(`${this.apiUrl}/signup`, user).pipe(
      tap((createdUser: UserI) => this.snackbar.open(`User ${createdUser.username} created successfully`, 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      })),
      catchError(e => {
        this.snackbar.open(`User could not be created, due to: ${e.error.message}`, 'Close', {
          duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
        });
        return throwError(e);
      })
    );
  }

  login(user: UserI): Observable<LoginResponseI> {
    return this.http.post<LoginResponseI>(`${this.apiUrl}/login`, user).pipe(
      tap((res: LoginResponseI) => localStorage.setItem('nestjs_chat_app', res.access_token)),
      tap(() => this.snackbar.open('Login Successful', 'Close', {
        duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
      }))
    );
  }

  findByUsername(username: string): Observable<UserI[]> {
    return this.http.get<UserI[]>(`${this.apiUrl}/find-by-username?username=${username}`);
  }


  //instead of geting all user we have on fetch only they are friends 
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }


  

  getCurrentUser(): UserI | null {
    const token = localStorage.getItem('nestjs_chat_app');
    console.log(token)
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      return {
        id: decodedToken.sub,
        email: decodedToken.email
      };
    }
    return null;
  }
}
