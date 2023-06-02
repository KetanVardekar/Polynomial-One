import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditIntentsComponent } from './add-edit-intents.component';

describe('AddEditIntentsComponent', () => {
  let component: AddEditIntentsComponent;
  let fixture: ComponentFixture<AddEditIntentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditIntentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditIntentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
