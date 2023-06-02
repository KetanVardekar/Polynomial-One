import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevEventModuleComponent } from './dev-event-module.component';

describe('DevEventModuleComponent', () => {
  let component: DevEventModuleComponent;
  let fixture: ComponentFixture<DevEventModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevEventModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevEventModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
