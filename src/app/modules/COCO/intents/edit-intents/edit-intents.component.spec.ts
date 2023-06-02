import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIntentsComponent } from './edit-intents.component';

describe('EditIntentsComponent', () => {
  let component: EditIntentsComponent;
  let fixture: ComponentFixture<EditIntentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditIntentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIntentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
