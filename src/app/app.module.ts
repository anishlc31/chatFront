import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtModule } from '@auth0/angular-jwt';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

export function tokenGetter() {
  return localStorage.getItem("nestjs_chat_app");
}

// const config: SocketIoConfig = {
//   url: 'http://localhost:3000',
//   options: {
//     transportOptions: {
//       polling: {
//         extraHeaders: {
//           Authorization: tokenGetter() 
//         }
//       }
//     }
//   }
// };




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:3000']
      }
    }),
    //SocketIoModule.forRoot(config) // Ensure this is correctly set up

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }