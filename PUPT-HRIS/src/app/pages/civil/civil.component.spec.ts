import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CivilComponent } from './civil.component';

describe('CivilComponent', () => {
  let component: CivilComponent;
  let fixture: ComponentFixture<CivilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CivilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CivilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
