import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCoordinatorComponent } from './add-edit-coordinator.component';

describe('AddEditCoordinatorComponent', () => {
  let component: AddEditCoordinatorComponent;
  let fixture: ComponentFixture<AddEditCoordinatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCoordinatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCoordinatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
