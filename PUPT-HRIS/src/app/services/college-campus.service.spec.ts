import { TestBed } from '@angular/core/testing';

import { CollegeCampusService } from './college-campus.service';

describe('CollegeCampusService', () => {
  let service: CollegeCampusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollegeCampusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
