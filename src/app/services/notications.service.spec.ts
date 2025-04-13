import { TestBed } from '@angular/core/testing';

import { NoticationsService } from './notications.service';

describe('NoticationsPushService', () => {
  let service: NoticationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoticationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
