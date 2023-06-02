import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableApiComponent } from './available-api.component';

describe('AvailableApiComponent', () => {
  let component: AvailableApiComponent;
  let fixture: ComponentFixture<AvailableApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
