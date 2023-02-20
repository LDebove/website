import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from './shared/layout/layout.module';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./core/home/home.module').then((m) => m.HomeModule)
      },
      {
        path: 'image-editor',
        loadChildren: () => import('./core/image-editor/image-editor.module').then((m) => m.ImageEditorModule)
      },
      {
        path: 'tww3-random-lord',
        loadChildren: () => import('./core/tww3-random-lord/tww3-random-lord.module').then((m) => m.Tww3RandomLordModule)
      },
      {
        path: 'terraria-pixelart',
        loadChildren: () => import('./core/terraria-pixelart/terraria-pixelart.module').then((m) => m.TerrariaPixelartModule)
      },
      {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
