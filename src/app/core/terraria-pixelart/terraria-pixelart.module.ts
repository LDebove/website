import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerrariaPixelartRoutingModule } from './terraria-pixelart-routing.module';
import { TerrariaPixelartComponent } from './terraria-pixelart.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TerrariaPixelartComponent
  ],
  imports: [
    CommonModule,
    TerrariaPixelartRoutingModule,
    SharedModule
  ]
})
export class TerrariaPixelartModule { }
