import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreAgentsComponent } from './add-more-agents.component';

describe('AddMoreAgentsComponent', () => {
  let component: AddMoreAgentsComponent;
  let fixture: ComponentFixture<AddMoreAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoreAgentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
