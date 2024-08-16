import { TestBed } from '@angular/core/testing';

import { AdditionalQuestionService } from './additional-question.service';

describe('AdditionalQuestionService', () => {
  let service: AdditionalQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdditionalQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
