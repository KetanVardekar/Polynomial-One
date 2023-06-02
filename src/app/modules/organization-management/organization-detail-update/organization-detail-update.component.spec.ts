import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationDetailUpdateComponent } from './organization-detail-update.component';

describe('OrganizationDetailUpdateComponent', () => {
  let component: OrganizationDetailUpdateComponent;
  let fixture: ComponentFixture<OrganizationDetailUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationDetailUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationDetailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
