import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OddMessageCardComponent } from './odd-message-card.component';

describe('OddMessageCardComponent', () => {
  let component: OddMessageCardComponent;
  let fixture: ComponentFixture<OddMessageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OddMessageCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OddMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
