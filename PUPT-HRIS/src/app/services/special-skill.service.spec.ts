import { TestBed } from '@angular/core/testing';

import { SpecialSkillService } from './special-skill.service';

describe('SpecialSkillService', () => {
  let service: SpecialSkillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialSkillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
