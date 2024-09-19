import { TestBed } from '@angular/core/testing';

import { PdsService } from './pds.service';

describe('PdsService', () => {
  let service: PdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
