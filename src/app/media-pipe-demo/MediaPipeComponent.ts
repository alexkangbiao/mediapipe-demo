import { AfterViewInit, Directive, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as drawingUtils from '@mediapipe/drawing_utils';
import * as controls from '@mediapipe/control_utils';
import { testSupport } from "../tools/utility";

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


  constructor() {
    this.fpsControl = new controls.FPS();
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

}

