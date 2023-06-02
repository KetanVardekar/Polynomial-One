import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedCoordinatorComponent } from './mapped-coordinator.component';

describe('MappedCoordinatorComponent', () => {
  let component: MappedCoordinatorComponent;
  let fixture: ComponentFixture<MappedCoordinatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappedCoordinatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappedCoordinatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
