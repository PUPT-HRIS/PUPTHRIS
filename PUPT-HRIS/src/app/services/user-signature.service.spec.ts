import { TestBed } from '@angular/core/testing';

import { UserSignatureService } from './user-signature.service';

describe('UserSignatureService', () => {
  let service: UserSignatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSignatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
