import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerrariaPixelartComponent } from './terraria-pixelart.component';

const routes: Routes = [{ path: '', component: TerrariaPixelartComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerrariaPixelartRoutingModule { }
