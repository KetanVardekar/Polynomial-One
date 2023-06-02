import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessKeysComponent } from './access-keys.component';

describe('AccessKeysComponent', () => {
  let component: AccessKeysComponent;
  let fixture: ComponentFixture<AccessKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessKeysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
