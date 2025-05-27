import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfopagePage } from './infopage.page';

describe('InfopagePage', () => {
  let component: InfopagePage;
  let fixture: ComponentFixture<InfopagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfopagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
