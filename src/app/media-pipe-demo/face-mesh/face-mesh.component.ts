import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as drawingUtils from '@mediapipe/drawing_utils';
import * as controls from '@mediapipe/control_utils';
import { testSupport } from 'src/app/tools/utility';
import { FaceMesh, FACEMESH_FACE_OVAL, FACEMESH_LEFT_EYE, FACEMESH_LEFT_EYEBROW, FACEMESH_LEFT_IRIS, FACEMESH_LIPS, FACEMESH_RIGHT_EYE, FACEMESH_RIGHT_EYEBROW, FACEMESH_RIGHT_IRIS, FACEMESH_TESSELATION, Options, Results } from '@mediapipe/face_mesh';

@Component({
  selector: 'app-face-mesh',
  templateUrl: './face-mesh.component.html',
  styleUrls: ['./face-mesh.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FaceMeshComponent implements OnInit, AfterViewInit {

  @ViewChild("output_canvas")
  canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild("input_video")
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild("control_panel")
  controlsElement!: ElementRef<HTMLDivElement>;

  canvasContext!: any;
  controlPanel!: controls.ControlPanel;
  fpsControl!: controls.FPS;
  faceMesh!: FaceMesh;
  /**
       * Solution options.
       */
  solutionOptions = {
    selfieMode: true,
    enableFaceGeometry: false,
    maxNumFaces: 1,
    refineLandmarks: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  };

  constructor() {
    this.fpsControl = new controls.FPS();
  }

  ngOnInit(): void {
    testSupport([{ client: 'Chrome' },]);
  }

  ngAfterViewInit(): void {
    this.canvasContext = this.canvasElement.nativeElement.getContext('2d');

    this.initFaceMesh();
    this.initControlPanel();
  }

  initFaceMesh(): void {
    this.faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `assets/face_mesh/${file}`;
        // return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@` +
        //   `${VERSION}/${file}`;
      }
    });
    this.faceMesh.setOptions(this.solutionOptions);
    this.faceMesh.onResults((results: Results) => {
      // Hide the spinner.
      document.body.classList.add('loaded');

      // Update the frame rate.
      this.fpsControl.tick();

      // Draw the overlays.
      this.canvasContext.save();
      this.canvasContext.clearRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
      this.canvasContext.drawImage(
        results.image, 0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawingUtils.drawConnectors(
            this.canvasContext, landmarks, FACEMESH_TESSELATION,
            { color: '#C0C0C070', lineWidth: 1 });
          drawingUtils.drawConnectors(
            this.canvasContext, landmarks, FACEMESH_RIGHT_EYE,
            { color: '#FF3030' });
          drawingUtils.drawConnectors(
            this.canvasContext, landmarks, FACEMESH_RIGHT_EYEBROW,
            { color: '#FF3030' });
          drawingUtils.drawConnectors(
            this.canvasContext, landmarks, FACEMESH_LEFT_EYE,
            { color: '#30FF30' });
          drawingUtils.drawConnectors(
            this.canvasContext, landmarks, FACEMESH_LEFT_EYEBROW,
            { color: '#30FF30' });
          drawingUtils.drawConnectors(
            this.canvasContext, landmarks, FACEMESH_FACE_OVAL,
            { color: '#E0E0E0' });
          drawingUtils.drawConnectors(
            this.canvasContext, landmarks, FACEMESH_LIPS, { color: '#E0E0E0' });
          if (this.solutionOptions.refineLandmarks) {
            drawingUtils.drawConnectors(
              this.canvasContext, landmarks, FACEMESH_RIGHT_IRIS,
              { color: '#FF3030' });
            drawingUtils.drawConnectors(
              this.canvasContext, landmarks, FACEMESH_LEFT_IRIS,
              { color: '#30FF30' });
          }
        }
      }
      this.canvasContext.restore();
    });
  }

  initControlPanel(): void {
    this.controlPanel = new controls
      .ControlPanel(this.controlsElement.nativeElement, this.solutionOptions)
      .add([
        new controls.StaticText({ title: 'MediaPipe Face Mesh' }),
        this.fpsControl,
        new controls.Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
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
              await this.faceMesh.send({ image: input });
            },
        }),
        new controls.Slider({
          title: 'Max Number of Faces',
          field: 'maxNumFaces',
          range: [1, 4],
          step: 1
        }),
        new controls.Toggle(
          { title: 'Refine Landmarks', field: 'refineLandmarks' }),
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
      .on((x: Options) => {
        const options = x as Options;
        this.videoElement.nativeElement.classList.toggle('selfie', options.selfieMode);
        this.faceMesh.setOptions(options);
      });
  }
}

