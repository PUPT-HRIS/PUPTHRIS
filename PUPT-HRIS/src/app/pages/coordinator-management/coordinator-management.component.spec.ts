import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorManagementComponent } from './coordinator-management.component';

describe('CoordinatorManagementComponent', () => {
  let component: CoordinatorManagementComponent;
  let fixture: ComponentFixture<CoordinatorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoordinatorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
