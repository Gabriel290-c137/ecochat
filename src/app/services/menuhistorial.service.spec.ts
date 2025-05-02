import { TestBed } from '@angular/core/testing';

import { MenuHistorialService } from './menuhistorial.service';

describe('MenuhistorialService', () => {
  let service: MenuHistorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuHistorialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
