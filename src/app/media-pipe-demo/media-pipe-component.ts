import { AfterViewInit, Directive, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as drawingUtils from '@mediapipe/drawing_utils';
import * as controls from '@mediapipe/control_utils';
import { allowFullScreen, exitFullScreen, isFullScreen, testSupport } from "../tools/utility";

@Directive()
export abstract class MediaPipeComponents implements OnInit, AfterViewInit {
  
  public isLoading: boolean = true;

  @ViewChild("output_canvas")
  canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild("input_video")
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild("control_panel")
  controlsElement!: ElementRef<HTMLDivElement>;

  canvasContext!: any;
  controlPanel!: controls.ControlPanel;
  fpsControl!: controls.FPS;
  isFullScreenShown: boolean = false;

  constructor() {
    this.fpsControl = new controls.FPS();
    this.isFullScreenShown = isFullScreen();
  }


  ngOnInit(): void {
    testSupport([{ client: 'Chrome' },]);
  }

  ngAfterViewInit(): void {
    this.canvasContext = this.canvasElement.nativeElement.getContext('2d');

    this.init();
    this.initControlPanel();
  }

  abstract init(): void;
  abstract initControlPanel(): void;

  fullScreen() : void {
    if (!isFullScreen()) {
          allowFullScreen();
    }
    if (isFullScreen()) {
          exitFullScreen();
    }
    this.isFullScreenShown = !this.isFullScreenShown;
  }

}

