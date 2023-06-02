import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementSubComponentComponent } from './user-management-sub-component.component';

describe('UserManagementSubComponentComponent', () => {
  let component: UserManagementSubComponentComponent;
  let fixture: ComponentFixture<UserManagementSubComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserManagementSubComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementSubComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
