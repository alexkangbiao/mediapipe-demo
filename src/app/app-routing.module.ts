import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FaceDetectionComponent } from './media-pipe-demo/face-detection/face-detection.component';
import { FaceMeshComponent } from './media-pipe-demo/face-mesh/face-mesh.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "face-detection",
    component: FaceDetectionComponent,
    data: { demo: true, name: "Face Detection" },
  },
  {
    path: "face-mesh",
    component: FaceMeshComponent,
    data: { demo: true, name: "Face Mesh" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
