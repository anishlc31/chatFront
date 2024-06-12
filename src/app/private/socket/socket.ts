import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { tokenGetter } from 'src/app/app.module';

const getSocketConfig = (): SocketIoConfig => {
  const token = tokenGetter();
  return {
    url: 'http://localhost:3000',
    options: {
      extraHeaders: {
        Authorization: token ? token : '' // Ensure Authorization is always a string
      }
    }
  };
};

@Injectable({ providedIn: 'root' })
export class CustomSocket extends Socket {
  constructor() {
    super(getSocketConfig());
  }
}
