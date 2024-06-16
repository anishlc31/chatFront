import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLineModule } from '@angular/material/core';
import { PrivateRoutingModule } from './private-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatListModule} from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    MatLineModule,
    MatListModule,
  
    ReactiveFormsModule
    
  ]
})
export class PrivateModule { }

