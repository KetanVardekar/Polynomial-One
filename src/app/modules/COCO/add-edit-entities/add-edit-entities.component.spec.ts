import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEntitiesComponent } from './add-edit-entities.component';

describe('AddEditEntitiesComponent', () => {
  let component: AddEditEntitiesComponent;
  let fixture: ComponentFixture<AddEditEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEntitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
