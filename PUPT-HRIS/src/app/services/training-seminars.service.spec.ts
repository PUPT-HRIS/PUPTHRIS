import { TestBed } from '@angular/core/testing';

import { TrainingSeminarsService } from './training-seminars.service';

describe('TrainingSeminarsService', () => {
  let service: TrainingSeminarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingSeminarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
