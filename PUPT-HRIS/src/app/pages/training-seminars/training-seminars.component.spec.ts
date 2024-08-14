import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSeminarsComponent } from './training-seminars.component';

describe('TrainingSeminarsComponent', () => {
  let component: TrainingSeminarsComponent;
  let fixture: ComponentFixture<TrainingSeminarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingSeminarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingSeminarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
