import { TestBed } from '@angular/core/testing';

import { NewChatService } from './newchat.service';

describe('NewchatService', () => {
  let service: NewChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
