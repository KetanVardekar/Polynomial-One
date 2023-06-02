import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRelationshipComponent } from './data-relationship.component';

describe('DataRelationshipComponent', () => {
  let component: DataRelationshipComponent;
  let fixture: ComponentFixture<DataRelationshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataRelationshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
