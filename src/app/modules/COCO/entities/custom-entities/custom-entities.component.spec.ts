import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEntitiesComponent } from './custom-entities.component';

describe('CustomEntitiesComponent', () => {
  let component: CustomEntitiesComponent;
  let fixture: ComponentFixture<CustomEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomEntitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
