import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FaceDetectionComponent } from './media-pipe-demo/face-detection/face-detection.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "face-detection",
    component: FaceDetectionComponent,
    data: { demo: true, name: "Face Detection" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
