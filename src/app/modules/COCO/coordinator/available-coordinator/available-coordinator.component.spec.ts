import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableCoordinatorComponent } from './available-coordinator.component';

describe('AvailableCoordinatorComponent', () => {
  let component: AvailableCoordinatorComponent;
  let fixture: ComponentFixture<AvailableCoordinatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableCoordinatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableCoordinatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
