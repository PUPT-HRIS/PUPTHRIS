import { TestBed } from '@angular/core/testing';

import { CivilService } from './civil.service';

describe('CivilService', () => {
  let service: CivilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CivilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
