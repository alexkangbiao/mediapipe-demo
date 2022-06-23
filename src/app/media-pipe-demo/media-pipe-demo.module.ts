import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceDetectionComponent } from './face-detection/face-detection.component';
import { FaceMeshComponent } from './face-mesh/face-mesh.component';



@NgModule({
  declarations: [
    FaceDetectionComponent,
    FaceMeshComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MediaPipeDemoModule { }
