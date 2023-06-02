import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurePopUpComponent } from './configure-pop-up.component';

describe('ConfigurePopUpComponent', () => {
  let component: ConfigurePopUpComponent;
  let fixture: ComponentFixture<ConfigurePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurePopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
