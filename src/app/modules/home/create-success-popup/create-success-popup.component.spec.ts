import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSuccessPopupComponent } from './create-success-popup.component';

describe('CreateSuccessPopupComponent', () => {
  let component: CreateSuccessPopupComponent;
  let fixture: ComponentFixture<CreateSuccessPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSuccessPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
