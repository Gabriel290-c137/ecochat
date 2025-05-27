import { TestBed } from '@angular/core/testing';

import { NoticationsPushService  } from './notificacionespush.service';

describe('NotificacionespushService', () => {
  let service: NoticationsPushService ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoticationsPushService );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
