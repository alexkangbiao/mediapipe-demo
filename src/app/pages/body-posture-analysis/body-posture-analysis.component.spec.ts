import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyPostureAnalysisComponent } from './body-posture-analysis.component';

describe('BodyPostureAnalysisComponent', () => {
  let component: BodyPostureAnalysisComponent;
  let fixture: ComponentFixture<BodyPostureAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BodyPostureAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyPostureAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
