import { TestBed } from '@angular/core/testing';

import { PersonalDetailsService } from './personal-details.service';

describe('PersonalDetailsService', () => {
  let service: PersonalDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
