import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSlotPopUpComponent } from './add-slot-pop-up.component';

describe('AddSlotPopUpComponent', () => {
  let component: AddSlotPopUpComponent;
  let fixture: ComponentFixture<AddSlotPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSlotPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSlotPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
