import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditApiIntegrationsComponent } from './add-edit-api-integrations.component';

describe('AddEditApiIntegrationsComponent', () => {
  let component: AddEditApiIntegrationsComponent;
  let fixture: ComponentFixture<AddEditApiIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditApiIntegrationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditApiIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
