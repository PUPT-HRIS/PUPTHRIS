import { TestBed } from '@angular/core/testing';

import { CampusContextService } from './campus-context.service';

describe('CampusContextService', () => {
  let service: CampusContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampusContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
