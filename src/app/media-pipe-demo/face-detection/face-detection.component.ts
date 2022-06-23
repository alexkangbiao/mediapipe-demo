import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FaceDetection, Options, Results } from '@mediapipe/face_detection';
import * as drawingUtils from '@mediapipe/drawing_utils';
import * as controls from '@mediapipe/control_utils';
import { testSupport } from 'src/app/tools/utility';

@Component({
  selector: 'app-face-detection',
  templateUrl: './face-detection.component.html',
  styleUrls: ['./face-detection.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FaceDetectionComponent implements OnInit, AfterViewInit {

  @ViewChild("output_canvas")
  canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild("input_video")
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild("control_panel")
  controlsElement!: ElementRef<HTMLDivElement>;

  isLoading: boolean = true;
  faceDetection: FaceDetection;
  canvasContext!: CanvasRenderingContext2D;
  fpsControl: controls.FPS;
  controlPanel!: controls.ControlPanel;

  constructor() {
    this.faceDetection = new FaceDetection(
      {
        locateFile: (file) => {
          return `assets/face_detection/${file}`;
          // return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/${file}`;
        }
      }
    );

    // We'll add this to our control panel later, but we'll save it here so we can
    // call tick() each time the graph runs.
    this.fpsControl = new controls.FPS();
  }

  ngOnInit(): void {
    // Usage: testSupport({client?: string, os?: string}[])
    // Client and os are regular expressions.
    // See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for
    // legal values for client and os
    testSupport([{ client: 'Chrome' },]);
  }

  ngAfterViewInit(): void {
    this.canvasContext = this.canvasElement?.nativeElement.getContext('2d')!;

    this.isLoading = false;

    this.initControlPanel();

    // Optimization: Turn off animated spinner after its hiding animation is done.
    const spinner = document.querySelector('.loading')! as HTMLDivElement;
    spinner.ontransitionend = () => {
      spinner.style.display = 'none';
    };

    this.faceDetection.onResults((results: Results) => {
      // Hide the spinner.
      document.body.classList.add('loaded');

      // Update the frame rate.
      this.fpsControl.tick();

      // Draw the overlays.
      this.canvasContext.save();
      this.canvasContext.clearRect(0, 0, this.canvasElement!.nativeElement.width, this.canvasElement!.nativeElement.height);
      this.canvasContext.drawImage(
        results.image, 0, 0, this.canvasElement!.nativeElement.width, this.canvasElement!.nativeElement.height);
      if (results.detections.length > 0) {
        drawingUtils.drawRectangle(
          this.canvasContext, results.detections[0].boundingBox,
          { color: 'blue', lineWidth: 4, fillColor: '#00000000' });
        drawingUtils.drawLandmarks(this.canvasContext, results.detections[0].landmarks, {
          color: 'red',
          radius: 5,
        });
      }
      this.canvasContext.restore();
    }
    );
  }

  initControlPanel(): void {
    // Present a control panel through which the user can manipulate the solution
    // options.
    this.controlPanel = new controls.ControlPanel(this.controlsElement.nativeElement!, {
      selfieMode: true,
      model: 'short',
      minDetectionConfidence: 0.5,
    })
      .add([
        new controls.StaticText({ title: 'MediaPipe Face Detection' }),
        this.fpsControl,
        new controls.Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
        new controls.SourcePicker({
          onSourceChanged: () => {
            this.faceDetection.reset();
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
              this.canvasElement.nativeElement!.width = width;
              this.canvasElement.nativeElement.height = height;
              await this.faceDetection.send({ image: input });
            },
          examples: {
            images: [],
            videos: [],
          },
        }),
        new controls.Slider({
          title: 'Model Selection',
          field: 'model',
          discrete: { 'short': 'Short-Range', 'full': 'Full-Range' },
        }),
        new controls.Slider({
          title: 'Min Detection Confidence',
          field: 'minDetectionConfidence',
          range: [0, 1],
          step: 0.01
        }),
      ])
      .on(x => {
        const options = x as Options;
        this.videoElement.nativeElement.classList.toggle('selfie', options.selfieMode);
        this.faceDetection.setOptions(options);
      });
  }

}



