import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalEntitiesComponent } from './global-entities.component';

describe('GlobalEntitiesComponent', () => {
  let component: GlobalEntitiesComponent;
  let fixture: ComponentFixture<GlobalEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalEntitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
