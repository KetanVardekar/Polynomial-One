import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysolutionComponent } from './mysolution.component';

describe('MysolutionComponent', () => {
  let component: MysolutionComponent;
  let fixture: ComponentFixture<MysolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MysolutionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MysolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
