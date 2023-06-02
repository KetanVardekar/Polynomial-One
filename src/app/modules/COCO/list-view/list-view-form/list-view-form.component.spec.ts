import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewFormComponent } from './list-view-form.component';

describe('ListViewFormComponent', () => {
  let component: ListViewFormComponent;
  let fixture: ComponentFixture<ListViewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListViewFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
