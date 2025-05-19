import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizacionesPage } from './localizaciones.page';

describe('LocalizacionesPage', () => {
  let component: LocalizacionesPage;
  let fixture: ComponentFixture<LocalizacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
