import { TestBed } from '@angular/core/testing';

import { VoluntaryworkService } from './voluntarywork.service';

describe('VoluntaryworkService', () => {
  let service: VoluntaryworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoluntaryworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
