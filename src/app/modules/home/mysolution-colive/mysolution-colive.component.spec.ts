import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysolutionColiveComponent } from './mysolution-colive.component';

describe('MysolutionColiveComponent', () => {
  let component: MysolutionColiveComponent;
  let fixture: ComponentFixture<MysolutionColiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MysolutionColiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MysolutionColiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
