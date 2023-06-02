import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OddMessageFormComponent } from './odd-message-form.component';

describe('OddMessageFormComponent', () => {
  let component: OddMessageFormComponent;
  let fixture: ComponentFixture<OddMessageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OddMessageFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OddMessageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
