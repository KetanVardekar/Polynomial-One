import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewCardComponent } from './list-view-card.component';

describe('ListViewCardComponent', () => {
  let component: ListViewCardComponent;
  let fixture: ComponentFixture<ListViewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListViewCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
