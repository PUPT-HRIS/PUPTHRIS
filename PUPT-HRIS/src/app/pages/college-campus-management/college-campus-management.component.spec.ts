import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeCampusManagementComponent } from './college-campus-management.component';

describe('CollegeCampusManagementComponent', () => {
  let component: CollegeCampusManagementComponent;
  let fixture: ComponentFixture<CollegeCampusManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeCampusManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollegeCampusManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
