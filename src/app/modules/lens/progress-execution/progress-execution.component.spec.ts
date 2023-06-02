import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressExecutionComponent } from './progress-execution.component';

describe('ProgressExecutionComponent', () => {
  let component: ProgressExecutionComponent;
  let fixture: ComponentFixture<ProgressExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressExecutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
