import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilePopUpComponent } from './upload-file-pop-up.component';

describe('UploadFilePopUpComponent', () => {
  let component: UploadFilePopUpComponent;
  let fixture: ComponentFixture<UploadFilePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFilePopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFilePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
