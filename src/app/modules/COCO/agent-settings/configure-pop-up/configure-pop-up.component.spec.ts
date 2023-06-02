import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureLogs } from './configure-pop-up.component';

describe('ConfigureLogs', () => {
  let component: ConfigureLogs;
  let fixture: ComponentFixture<ConfigureLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureLogs ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
