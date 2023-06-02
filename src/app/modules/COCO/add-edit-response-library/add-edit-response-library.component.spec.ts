import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditResponseLibraryComponent } from './add-edit-response-library.component';

describe('AddEditResponseLibraryComponent', () => {
  let component: AddEditResponseLibraryComponent;
  let fixture: ComponentFixture<AddEditResponseLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditResponseLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditResponseLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
