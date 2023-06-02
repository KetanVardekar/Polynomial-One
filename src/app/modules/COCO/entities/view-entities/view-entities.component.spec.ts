import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEntitiesComponent } from './view-entities.component';

describe('ViewEntitiesComponent', () => {
  let component: ViewEntitiesComponent;
  let fixture: ComponentFixture<ViewEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEntitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
