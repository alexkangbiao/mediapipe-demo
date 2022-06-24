import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FaceDetectionComponent } from './media-pipe-demo/face-detection.component';
import { FaceMeshComponent } from './media-pipe-demo/face-mesh.component';
import { HandsComponent } from './media-pipe-demo/hands.component';
import { PoseComponent } from './media-pipe-demo/pose.component';
import { BodyPostureAnalysisComponent } from './pages/body-posture-analysis/body-posture-analysis.component';

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
  {
    path: "body-posture-analysis",
    component: BodyPostureAnalysisComponent,
    data: { demo: true, name: "Body Posture Analysis" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
