import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIntentsComponent } from './view-intents.component';

describe('ViewIntentsComponent', () => {
  let component: ViewIntentsComponent;
  let fixture: ComponentFixture<ViewIntentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIntentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIntentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
