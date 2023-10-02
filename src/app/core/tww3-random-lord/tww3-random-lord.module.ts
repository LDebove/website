import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Tww3RandomLordRoutingModule } from './tww3-random-lord-routing.module';
import { Tww3RandomLordComponent } from './tww3-random-lord.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';


@NgModule({
  declarations: [
    Tww3RandomLordComponent,
    DisclaimerComponent
  ],
  imports: [
    CommonModule,
    Tww3RandomLordRoutingModule,
    SharedModule
  ]
})
export class Tww3RandomLordModule { }
