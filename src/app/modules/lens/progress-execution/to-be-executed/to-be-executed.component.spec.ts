import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToBeExecutedComponent } from './to-be-executed.component';

describe('ToBeExecutedComponent', () => {
  let component: ToBeExecutedComponent;
  let fixture: ComponentFixture<ToBeExecutedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToBeExecutedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToBeExecutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
