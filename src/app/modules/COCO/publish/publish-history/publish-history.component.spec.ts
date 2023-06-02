import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishHistoryComponent } from './publish-history.component';

describe('PublishHistoryComponent', () => {
  let component: PublishHistoryComponent;
  let fixture: ComponentFixture<PublishHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
