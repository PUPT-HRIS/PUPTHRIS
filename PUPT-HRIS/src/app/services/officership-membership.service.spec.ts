import { TestBed } from '@angular/core/testing';

import { OfficershipMembershipService } from './officership-membership.service';

describe('OfficershipMembershipService', () => {
  let service: OfficershipMembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficershipMembershipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
