import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedChannelComponent } from './selected-channel.component';

describe('SelectedChannelComponent', () => {
  let component: SelectedChannelComponent;
  let fixture: ComponentFixture<SelectedChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
