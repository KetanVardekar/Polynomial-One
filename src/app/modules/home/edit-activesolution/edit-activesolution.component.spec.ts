import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActivesolutionComponent } from './edit-activesolution.component';

describe('EditActivesolutionComponent', () => {
  let component: EditActivesolutionComponent;
  let fixture: ComponentFixture<EditActivesolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditActivesolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditActivesolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
