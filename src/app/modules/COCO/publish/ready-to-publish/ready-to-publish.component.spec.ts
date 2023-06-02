import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToPublishComponent } from './ready-to-publish.component';

describe('ReadyToPublishComponent', () => {
  let component: ReadyToPublishComponent;
  let fixture: ComponentFixture<ReadyToPublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadyToPublishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyToPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
