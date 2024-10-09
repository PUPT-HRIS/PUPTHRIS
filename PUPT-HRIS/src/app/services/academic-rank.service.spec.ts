import { TestBed } from '@angular/core/testing';

import { AcademicRankService } from './academic-rank.service';

describe('AcademicRankService', () => {
  let service: AcademicRankService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicRankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
