import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tww3RandomLordComponent } from './tww3-random-lord.component';

const routes: Routes = [{ path: '', component: Tww3RandomLordComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tww3RandomLordRoutingModule { }
