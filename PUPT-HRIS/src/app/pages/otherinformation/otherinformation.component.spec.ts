import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtherInformationComponent } from './otherinformation.component';

describe('OtherInformationComponent', () => {
  let component: OtherInformationComponent;
  let fixture: ComponentFixture<OtherInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
