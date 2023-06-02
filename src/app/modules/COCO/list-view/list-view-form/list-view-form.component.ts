import { ISResponseLibraryService } from './../../../core/services/IS/ISresponseLibrary.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';

@Component({
  selector: 'app-list-view-form',
  templateUrl: './list-view-form.component.html',
  styleUrls: ['./list-view-form.component.scss']
})
export class ListViewFormComponent implements OnInit {

  @Input() type: any;
  listForm: FormGroup | any;
  listArray: FormArray | any;
  convIndex: number | any;
  isUpdate: boolean = false;
  serviceId: any;
  botType: any;
  constructor(
    private formBuilder: FormBuilder,
    private isResponseLibraryService: ISResponseLibraryService
  ) { }

  ngOnInit(): void {

    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    //List view form
    this.listForm = this.formBuilder.group({
      title: [null, Validators.required],
      url: [null, Validators.required],
      values: new FormArray([
        this.listValueGroup()
      ])
    });
    this.listArray = this.listForm.get('values') as FormArray;

    this.isResponseLibraryService.get.subscribe(
      data => {

        if (data.action === "EDIT") {
          if (data && Object.keys(data).length === 0 && data.constructor === Object) {
            //Response is empty
            this.isUpdate = false;
          } else {

            let lv = data.payload.response;
            this.convIndex = data.convIndex;
            this.isUpdate = true;
            console.log("lv >>>>> ", lv);

            let valuesArray = this.listForm.get('values') as FormArray;
            valuesArray.clear();
            lv.values.forEach((value: any) => {
              valuesArray.push(new FormGroup({
                text: new FormControl(value.text, Validators.required),
                url: new FormControl(value.url, Validators.required)
              }));
            });


            this.listForm.patchValue({
              title: lv.title,
              url: lv.url
            });
          }
        }
      },
      error => {
        console.log(error);
      }
    );



  }

  listValueGroup(): FormGroup {
    return new FormGroup({
      text: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required)
    })
  }

  addValue = () => {
    this.listArray.push(this.listValueGroup());
  }

  add = () => {
    //add list to preview
    if (this.listForm.status === "VALID") {
      let obj: any = {};
      let pd = { ...this.listForm.value };
      if (this.listForm.status === "VALID") {
        obj["title"] = pd.title;
        obj["url"] = pd.url;
        obj["values"] = pd.values;

        this.isResponseLibraryService.addResp({ action: "ADD", payload: { type: this.type, response: obj } });
      }
    }
  }

  update = () => {
    let obj:any = {};
    let pd = { ...this.listForm.value };
    if (this.listForm.status === "VALID") {
      obj["title"] = pd.title;
      obj["url"] = pd.url;
      obj["values"] = pd.values;

      this.isResponseLibraryService.updateResp({ action: "UPDATE", payload: { type: this.type, response: obj }, convIndex: this.convIndex });
    }
  }

  remove = (index:any) => {
    this.listArray.removeAt(index);
  }

}
