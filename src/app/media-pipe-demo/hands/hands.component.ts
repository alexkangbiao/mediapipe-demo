import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

// import * as controls3d from '@mediapipe/control_utils_3d';
import * as controls from '@mediapipe/control_utils';
import * as drawingUtils from '@mediapipe/drawing_utils';

import { MediaPipeComponents } from '../media-pipe-component';
import { Hands, HAND_CONNECTIONS, LandmarkConnectionArray, Options, Results } from '@mediapipe/hands';

@Component({
  selector: 'app-hands',
  templateUrl: './hands.component.html',
  styleUrls: ['./hands.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HandsComponent extends MediaPipeComponents {
  
  @ViewChild("landmark_grid_container")
  landmarkContainerElement!: ElementRef<HTMLDivElement>;

  hands!: Hands;

  constructor() { 
    super();
  }

  init(): void {
    // const grid = new controls3d.LandmarkGrid(this.landmarkContainerElement.nativeElement, {
    //   connectionColor: 0xCCCCCC,
    //   definedColors:
    //       [{name: 'Left', value: 0xffa500}, {name: 'Right', value: 0x00ffff}],
    //   range: 0.2,
    //   fitToGrid: false,
    //   labelSuffix: 'm',
    //   landmarkSize: 2,
    //   numCellsPerAxis: 4,
    //   showHidden: false,
    //   centered: false,
    // });

    this.hands = new Hands({locateFile: (file: string) => {
      return `assets/hands/${file}`;
      // return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}/${file}`;
    }});
    this.hands.onResults((results: Results) => {
        // Hide the spinner.
        document.body.classList.add('loaded');

        // Update the frame rate.
        this.fpsControl.tick();

        // Draw the overlays.
        this.canvasContext.save();
        this.canvasContext.clearRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
        this.canvasContext.drawImage(
            results.image, 0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
        if (results.multiHandLandmarks && results.multiHandedness) {
          for (let index = 0; index < results.multiHandLandmarks.length; index++) {
            const classification = results.multiHandedness[index];
            const isRightHand = classification.label === 'Right';
            const landmarks = results.multiHandLandmarks[index];
            drawingUtils.drawConnectors(
                this.canvasContext, landmarks, HAND_CONNECTIONS,
                {color: isRightHand ? '#00FF00' : '#FF0000'});
            drawingUtils.drawLandmarks(this.canvasContext, landmarks, {
              color: isRightHand ? '#00FF00' : '#FF0000',
              fillColor: isRightHand ? '#FF0000' : '#00FF00',
              radius: (data: drawingUtils.Data) => {
                return drawingUtils.lerp(data.from!.z!, -0.15, .1, 10, 1);
              }
            });
          }
        }
        this.canvasContext.restore();

        // if (results.multiHandWorldLandmarks) {
        //   // We only get to call updateLandmarks once, so we need to cook the data to
        //   // fit. The landmarks just merge, but the connections need to be offset.
        //   const landmarks = results.multiHandWorldLandmarks.reduce(
        //       (prev, current) => [...prev, ...current], []);
        //   const colors = [];
        //   let connections: LandmarkConnectionArray = [];
        //   for (let loop = 0; loop < results.multiHandWorldLandmarks.length; ++loop) {
        //     const offset = loop * HAND_CONNECTIONS.length;
        //     const offsetConnections =
        //         HAND_CONNECTIONS.map(
        //             (connection) =>
        //                 [connection[0] + offset, connection[1] + offset]) as
        //         LandmarkConnectionArray;
        //     connections = connections.concat(offsetConnections);
        //     const classification = results.multiHandedness[loop];
        //     colors.push({
        //       list: offsetConnections.map((unused, i) => i + offset),
        //       color: classification.label,
        //     });
        //   }
        //   grid.updateLandmarks(landmarks, connections, colors);
        // } else {
        //   grid.updateLandmarks([]);
        // }
    });
  }

  initControlPanel(): void {
    this.controlPanel = new controls.ControlPanel(this.controlsElement.nativeElement, {
          selfieMode: true,
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        })
        .add([
          new controls.StaticText({title: 'MediaPipe Hands'}),
          this.fpsControl,
          new controls.Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
          new controls.SourcePicker({
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
                  await this.hands.send({image: input});
                },
          }),
          new controls.Slider({
            title: 'Max Number of Hands',
            field: 'maxNumHands',
            range: [1, 4],
            step: 1
          }),
          new controls.Slider({
            title: 'Model Complexity',
            field: 'modelComplexity',
            discrete: ['Lite', 'Full'],
          }),
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
        ])
        .on(x => {
          const options = x as Options;
          this.videoElement.nativeElement.classList.toggle('selfie', options.selfieMode);
          this.hands.setOptions(options);
        });
    
  }

}
