import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAnalyticsComponent } from './organization-analytics.component';

describe('OrganizationAnalyticsComponent', () => {
  let component: OrganizationAnalyticsComponent;
  let fixture: ComponentFixture<OrganizationAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
