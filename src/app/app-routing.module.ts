import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FaceDetectionComponent } from './media-pipe-demo/face-detection/face-detection.component';
import { FaceMeshComponent } from './media-pipe-demo/face-mesh/face-mesh.component';
import { HandsComponent } from './media-pipe-demo/hands/hands.component';
import { PoseComponent } from './media-pipe-demo/pose/pose.component';

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
  {
    path: "hands",
    component: HandsComponent,
    data: { demo: true, name: "Hands" },
  },
  {
    path: "pose",
    component: PoseComponent,
    data: { demo: true, name: "Pose" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
