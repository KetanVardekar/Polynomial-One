import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseLibraryComponent } from './response-library.component';

describe('ResponseLibraryComponent', () => {
  let component: ResponseLibraryComponent;
  let fixture: ComponentFixture<ResponseLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
