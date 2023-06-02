import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { OrganizationService } from '../../core/services/organization.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditMemberComponent } from '../../add-edit-member/add-edit-member.component';
import { DeletePopUpComponent } from '../../common/delete-pop-up/delete-pop-up.component';
import { objectEach } from 'highcharts';
import { fail } from 'assert';
@Component({
  selector: 'app-user-management-sub-component',
  templateUrl: './user-management-sub-component.component.html',
  styleUrls: ['./user-management-sub-component.component.scss'],
})
export class UserManagementSubComponentComponent implements OnInit {
  public unsubscribe: Subject<any> = new Subject();
  userMembers: any = [];
  deleteMembers: any = [];
  SelectedUser: any = [];
  userRole: any;
  data: any;
  userID: any;
  itm: any
  constructor(
    private organizationService: OrganizationService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,

    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.getUserMembers();
    this.userRole = localStorage.getItem('role');
    this.userID = localStorage.getItem('userID')
  }
  getUserMembers() {
    this.ngxService.start();
    this.organizationService
      .getUserMembers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.userMembers = data['data']['list'];
            console.log(this.userMembers)
            this.userMembers.map((x: any) => ({
              ...x, isDelete: 'false', isEdit: 'false'
            }));
            console.log(this.userMembers)
            // const itm = this.userMembers.filter((x: any) => (x.userID == this.userID) || (x.role == "Platform Admin" || x.role == "Technical Admin"))

            // console.log(itm)

            // if (itm && itm.length) {
            //   itm.forEach((element: any) => {
            //     element.isEdit = true;
            //     element.isDelete = true;
            //   });
            // }


            if (this.userRole == "technical_admin") {
              this.itm = this.userMembers.filter((user: any) => {
                return user.role !== 'User'
              })
              console.log(this.itm)
            } else if (this.userRole == "platform_admin") {
              this.itm = this.userMembers.filter((user1: any) => {
                return (user1.role != "Technical Admin" && user1.role != "User")
              })
              console.log(this.itm)
            }
            if (this.itm && this.itm.length) {
              this.itm.forEach((element: any) => {
                element.isEdit = true;
                element.isDelete = true;
              });
            }

            // if (this.userRole == "technical_admin") {
            //   const itm = this.userMembers.findIndex((object: any) => {
            //     return (object.role === "User")
            //   })
            //   this.userMembers.splice(itm, 1)
            //   console.log(this.userMembers)
            // } else if(this.userRole =="platform_admin"){
            //   const itm1 = this.userMembers.findIndex((object:any)=>{
            //     return (object.role === "User" && object.role =="Technical Admin")
            //   })
            //   this.userMembers.splice(itm1, 1)
            //   console.log(this.userMembers)
            // }
            this.ngxService.stop();
          } else {
            this.toastr.error(data['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.toastr.error(error.error['message']);
          this.ngxService.stop();
        }
      );
  }
  addMember() {
    const modalRef = this.modalService.open(AddEditMemberComponent, {
      // backdrop: true,
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.isAdd = true;
    modalRef.result.then(() => {
      this.getUserMembers();
    });
  }

  deleteMember(id?: any) {
    const modalRef = this.modalService.open(DeletePopUpComponent, {
      size: 'l',
    });
    modalRef.componentInstance.title = 'You want To delete this user named';
    modalRef.componentInstance.selectedName = id.firstName + " " + id.lastName;
    modalRef.result.then((result) => {

      if (result) {
        this.ngxService.start();
        if (id.userID) {
          this.deleteMembers.push(id.userID);
        }
        const payload = {
          memberID: this.deleteMembers,

        };
        this.organizationService
          .deleteUserMember(payload)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (data) => {
              if (data['status']) {
                this.toastr.success(data['message']);
                this.deleteMembers.pop()
                this.ngxService.stop();

                this.getUserMembers();
              } else {
                this.toastr.error(data['message']);
                this.ngxService.stop();
              }
            },
            (error) => {
              this.toastr.error(error.error['message']);
              this.ngxService.stop();
            }
          );

      }
    });
  }
  addOrDeleteMember(id: any) {
    if (this.deleteMembers && this.deleteMembers.length) {
      if (this.deleteMembers.includes(id.userID)) {
        this.deleteMembers.splice(this.deleteMembers.indexOf(id.userID), 1);
        id.isSelect = false;
      } else {
        this.deleteMembers.push(id.userID);
        id.isSelect = true;
      }
    } else {
      this.deleteMembers.push(id.userID);
      id.isSelect = true;
    }
  }
  editMember(data: any) {
    const modalRef = this.modalService.open(AddEditMemberComponent, {
      // backdrop: true,
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.editMemberDetails = data;
    modalRef.result.then(() => {
      this.getUserMembers();
    });
  }
}
