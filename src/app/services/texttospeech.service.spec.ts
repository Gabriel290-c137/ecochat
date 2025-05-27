import { TestBed } from '@angular/core/testing';

import { TextToSpeechService } from './texttospeech.service';

describe('TextToSpeechService', () => {
  let service: TextToSpeechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextToSpeechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
