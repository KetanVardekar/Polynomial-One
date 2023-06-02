import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainsComponent } from './brains.component';

describe('BrainsComponent', () => {
  let component: BrainsComponent;
  let fixture: ComponentFixture<BrainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrainsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
