import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MediaPipeComponents } from '../media-pipe-component';

import * as controls from '@mediapipe/control_utils';
import * as drawingUtils from '@mediapipe/drawing_utils';
import * as mpPose from '@mediapipe/pose';

@Component({
  selector: 'app-pose',
  templateUrl: './pose.component.html',
  styleUrls: ['./pose.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PoseComponent extends MediaPipeComponents {
  
  pose!: mpPose.Pose;
  activeEffect:string = 'mask';

  constructor() {
    super();
  }

  init(): void {
    this.pose = new mpPose.Pose({
      locateFile: (file) => {
        return `assets/pose/${file}`;
        // return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
      }
    });
    this.pose.onResults((results: mpPose.Results) => {
      // Hide the spinner.
      document.body.classList.add('loaded');
      
      // Update the frame rate.
      this.fpsControl.tick();
    
      // Draw the overlays.
      this.canvasContext.save();
      this.canvasContext.clearRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
    
      if (results.segmentationMask) {
        this.canvasContext.drawImage(
            results.segmentationMask, 0, 0, this.canvasElement.nativeElement.width,
            this.canvasElement.nativeElement.height);
    
        // Only overwrite existing pixels.
        if (this.activeEffect === 'mask' || this.activeEffect === 'both') {
          this.canvasContext.globalCompositeOperation = 'source-in';
          // This can be a color or a texture or whatever...
          this.canvasContext.fillStyle = '#00FF007F';
          this.canvasContext.fillRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
        } else {
          this.canvasContext.globalCompositeOperation = 'source-out';
          this.canvasContext.fillStyle = '#0000FF7F';
          this.canvasContext.fillRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
        }
    
        // Only overwrite missing pixels.
        this.canvasContext.globalCompositeOperation = 'destination-atop';
        this.canvasContext.drawImage(
            results.image, 0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
    
        this.canvasContext.globalCompositeOperation = 'source-over';
      } else {
         this.canvasContext.drawImage(
             results.image, 0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
      }
    
      if (results.poseLandmarks) {
        drawingUtils.drawConnectors(
            this.canvasContext, results.poseLandmarks, mpPose.POSE_CONNECTIONS,
            {visibilityMin: 0.65, color: 'white'});
        drawingUtils.drawLandmarks(
            this.canvasContext,
            Object.values(mpPose.POSE_LANDMARKS_LEFT)
                .map(index => results.poseLandmarks[index]),
            {visibilityMin: 0.65, color: 'white', fillColor: 'rgb(255,138,0)'});
        drawingUtils.drawLandmarks(
            this.canvasContext,
            Object.values(mpPose.POSE_LANDMARKS_RIGHT)
                .map(index => results.poseLandmarks[index]),
            {visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)'});
        drawingUtils.drawLandmarks(
            this.canvasContext,
            Object.values(mpPose.POSE_LANDMARKS_NEUTRAL)
                .map(index => results.poseLandmarks[index]),
            {visibilityMin: 0.65, color: 'white', fillColor: 'white'});
      }
      this.canvasContext.restore();
    
      // if (results.poseWorldLandmarks) {
      //   grid.updateLandmarks(results.poseWorldLandmarks, mpPose.POSE_CONNECTIONS, [
      //     {list: Object.values(mpPose.POSE_LANDMARKS_LEFT), color: 'LEFT'},
      //     {list: Object.values(mpPose.POSE_LANDMARKS_RIGHT), color: 'RIGHT'},
      //   ]);
      // } else {
      //   grid.updateLandmarks([]);
      // }
    
        
    });


  }
  initControlPanel(): void {
    new controls
    .ControlPanel(this.controlsElement.nativeElement, {
      selfieMode: true,
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      effect: 'background',
    })
    .add([
      new controls.StaticText({title: 'MediaPipe Pose'}),
      this.fpsControl,
      new controls.Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
      new controls.SourcePicker({
        onSourceChanged: () => {
          // Resets because this model gives better results when reset between
          // source changes.
          this.pose.reset();
        },
        onFrame:
            async (input: controls.InputImage, size: controls.Rectangle) => {
              const aspect = size.height / size.width;
              let width: number, height: number;
              if (window.innerWidth > window.innerHeight) {
                height = window.innerHeight;
                width = height / aspect;
              } else {
                width = window.innerWidth;
                height = width * aspect;
              }
              this.canvasElement.nativeElement.width = width;
              this.canvasElement.nativeElement.height = height;
              await this.pose.send({image: input});
            },
      }),
      new controls.Slider({
        title: 'Model Complexity',
        field: 'modelComplexity',
        discrete: ['Lite', 'Full', 'Heavy'],
      }),
      new controls.Toggle(
          {title: 'Smooth Landmarks', field: 'smoothLandmarks'}),
      new controls.Toggle(
          {title: 'Enable Segmentation', field: 'enableSegmentation'}),
      new controls.Toggle(
          {title: 'Smooth Segmentation', field: 'smoothSegmentation'}),
      new controls.Slider({
        title: 'Min Detection Confidence',
        field: 'minDetectionConfidence',
        range: [0, 1],
        step: 0.01
      }),
      new controls.Slider({
        title: 'Min Tracking Confidence',
        field: 'minTrackingConfidence',
        range: [0, 1],
        step: 0.01
      }),
      new controls.Slider({
        title: 'Effect',
        field: 'effect',
        discrete: {'background': 'Background', 'mask': 'Foreground'},
      }),
    ])
    .on(x => {
      const options = x as mpPose.Options;
      this.videoElement.nativeElement.classList.toggle('selfie', options.selfieMode);
      this.activeEffect = (x as {[key: string]: string})['effect'];
      this.pose.setOptions(options);
    });
  }

}
