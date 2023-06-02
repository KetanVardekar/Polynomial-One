import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveChannelComponent } from './active-channel.component';

describe('ActiveChannelComponent', () => {
  let component: ActiveChannelComponent;
  let fixture: ComponentFixture<ActiveChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
