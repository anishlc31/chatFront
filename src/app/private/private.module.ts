import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLineModule } from '@angular/material/core';
import { PrivateRoutingModule } from './private-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatListModule} from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './chat/chat.component';
import { UserlistComponent } from './userlist/userlist.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';


//import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations: [
    DashboardComponent,
    ChatComponent,
    UserlistComponent,
    TimeAgoPipe,
    TruncatePipe
    
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    MatLineModule,
    MatListModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    FormsModule    
  ]
})
export class PrivateModule { }

