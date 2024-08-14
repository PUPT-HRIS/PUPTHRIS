import { TestBed } from '@angular/core/testing';

import { CharacterReferenceService } from './character-reference.service';

describe('CharacterReferenceService', () => {
  let service: CharacterReferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterReferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
