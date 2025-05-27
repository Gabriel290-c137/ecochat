import { TestBed } from '@angular/core/testing';

import { EcoChatService } from './ecochat.service';

describe('EcochatService', () => {
  let service: EcoChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcoChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
