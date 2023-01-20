import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageEditorRoutingModule } from './image-editor-routing.module';
import { ImageEditorComponent } from './image-editor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreserveCanvasAspectRatioDirective } from './preserve-canvas-aspect-ratio.directive';


@NgModule({
  declarations: [
    ImageEditorComponent,
    PreserveCanvasAspectRatioDirective
  ],
  imports: [
    CommonModule,
    ImageEditorRoutingModule,
    SharedModule
  ]
})
export class ImageEditorModule { }
