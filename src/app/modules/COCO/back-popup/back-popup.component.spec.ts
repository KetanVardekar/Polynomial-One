import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackPopupComponent } from './back-popup.component';

describe('BackPopupComponent', () => {
  let component: BackPopupComponent;
  let fixture: ComponentFixture<BackPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
