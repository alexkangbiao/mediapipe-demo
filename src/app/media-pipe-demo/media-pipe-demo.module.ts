import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceDetectionComponent } from './face-detection/face-detection.component';
import { FaceMeshComponent } from './face-mesh/face-mesh.component';
import { HandsComponent } from './hands/hands.component';
import { PoseComponent } from './pose/pose.component';

@NgModule({
  declarations: [
    FaceDetectionComponent,
    FaceMeshComponent,
    HandsComponent,
    PoseComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MediaPipeDemoModule { }
