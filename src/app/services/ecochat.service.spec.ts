import { TestBed } from '@angular/core/testing';

import { EcochatService } from './ecochat.service';

describe('EcochatService', () => {
  let service: EcochatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcochatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
