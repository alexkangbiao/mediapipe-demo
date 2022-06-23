import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceMeshComponent } from './face-mesh.component';

describe('FaceMeshComponent', () => {
  let component: FaceMeshComponent;
  let fixture: ComponentFixture<FaceMeshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceMeshComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaceMeshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
