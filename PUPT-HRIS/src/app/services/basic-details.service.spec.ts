import { TestBed } from '@angular/core/testing';

import { BasicDetailsService } from './basic-details.service';

describe('BasicDetailsService', () => {
  let service: BasicDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
