import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { FileValidators } from 'ngx-file-drag-drop';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MysolutionService } from '../../core/services/mysolution.service';
import { takeUntil, throwIfEmpty } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mysolution',
  templateUrl: './mysolution.component.html',
  styleUrls: ['./mysolution.component.scss'],
})
export class MysolutionComponent implements OnInit {
  UploadFileFlag: boolean = false;
  editProfileFlag: boolean = true;
  profileflag: boolean = true;
  @Input() emptyPlaceholder: any;
  @Input() multiple: any;
  key: any;
  name: any;
  tag: any;
  Discription: any;
  solutionimage: any;
  copySolution = [];

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private mysolutionservice: MysolutionService,
    private toaster: ToastrService
  ) {}
  public unsubscribe = new Subject<any>();

  image: any;
  userName: any;
  fileControl = new FormControl(
    [],
    [FileValidators.required, FileValidators.maxFileCount(2)]
  );

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
    this.fileControl.valueChanges.subscribe(
      (files: File[]) => (this.fileControl.value, this.fileControl.valid)
    );
  }

  createSolution() {
    const payload = {
      link: this.key,
      solutionName: this.name,
      solutionTag: this.tag,
      solutionImage: this.solutionimage,
      description: this.Discription,
    };

    this.ngxService.start();
    this.mysolutionservice
      .activateSolution(payload)

      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (res: any) => {
          if (res['status']) {
            this.toaster.success(res['message']);
            this.copySolution = res.data.link;

            this.ngxService.stop();
          } else {
            this.toaster.error(res['message']);
            this.ngxService.stop();
          }
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }
  close() {
    this.activeModal.close();
  }
  copyInputMessages(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toastr.info('Copied to clipboard');
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.image = reader.result;
    };
    this.ngxService.start();
    this.mysolutionservice
      .fileUpload(formData)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.toastr.success(data['message']);
            this.image = data['data']['url'];

            this.ngxService.stop();
          } else {
            this.toastr.error(data['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      );
  }
  deleteImage() {
    this.image = '';
    this.profileflag = true;
    this.UploadFileFlag = false;
  }
  openImage() {
    this.profileflag = false;
    this.UploadFileFlag = true;
  }
  onValueChange(file: File[]) {}
}
