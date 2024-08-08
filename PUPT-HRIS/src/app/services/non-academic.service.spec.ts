import { TestBed } from '@angular/core/testing';

import { NonAcademicService } from './non-academic.service';

describe('NonAcademicService', () => {
  let service: NonAcademicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonAcademicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
