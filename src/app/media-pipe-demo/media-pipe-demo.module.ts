import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceDetectionComponent } from './face-detection.component';
import { FaceMeshComponent } from './face-mesh.component';
import { HandsComponent } from './hands.component';
import { PoseComponent } from './pose.component';

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
