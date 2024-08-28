import { TestBed } from '@angular/core/testing';

import { AchievementAwardsService } from './achievement-awards.service';

describe('AchievementAwardsService', () => {
  let service: AchievementAwardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AchievementAwardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
