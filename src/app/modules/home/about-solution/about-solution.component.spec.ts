import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSolutionComponent } from './about-solution.component';

describe('AboutSolutionComponent', () => {
  let component: AboutSolutionComponent;
  let fixture: ComponentFixture<AboutSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutSolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
