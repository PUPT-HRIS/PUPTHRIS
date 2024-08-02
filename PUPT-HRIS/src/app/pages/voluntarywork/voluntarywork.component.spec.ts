import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoluntaryworkComponent } from './voluntarywork.component';

describe('VoluntaryworkComponent', () => {
  let component: VoluntaryworkComponent;
  let fixture: ComponentFixture<VoluntaryworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoluntaryworkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoluntaryworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
