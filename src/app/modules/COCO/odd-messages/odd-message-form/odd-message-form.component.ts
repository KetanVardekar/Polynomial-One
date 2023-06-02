import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-odd-message-form',
  templateUrl: './odd-message-form.component.html',
  styleUrls: ['./odd-message-form.component.scss']
})
export class OddMessageFormComponent implements OnInit {

  serviceId:any;
  botType:any;
  constructor(private formBuilder: FormBuilder) { }
  oddMsgForm: FormGroup | any;
  oddMsgArray: FormArray | any;
  @Output() onAddOddMsgResp = new EventEmitter<any>();
  @Output() onUpdateOddMsgResp = new EventEmitter<any>();
  @Input() update: any;
  @Input() selectedRC: any;
  @Input() set setOddMsgsArr(oddMsgsArr: [string]) {
    //if array is not empty then populate form with it
    if (oddMsgsArr.length > 0) {
      this.populateForm(oddMsgsArr);
    }
  }

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    if (!this.oddMsgForm) {
      this.initForm();
    }
  }

  //Clear form and populate it with data from Response Library
  populateForm = (oddMsgArr: [string]) => {
    if (!this.oddMsgForm) {
      this.resetForm();
    }


    //this.oddMsgForm.clear();
    let text = this.oddMsgForm.get("text") as FormArray;
    oddMsgArr.forEach((item: any, index: number) => {
      text.push(this.oddMsgGroup(item));
    });

  }

  //Reset form and add one text box to it.
  initForm = () => {
    this.resetForm();
    this.addOddMsg();
  }

  resetForm = () => {
    this.oddMsgForm = this.formBuilder.group({
      text: new FormArray([])
    });
    this.oddMsgArray = this.oddMsgForm.get('text') as FormArray;
  }

  oddMsgGroup(text: string): FormGroup {
    return new FormGroup({
      text: new FormControl(text, Validators.required)
    })
  }


  addOddMsg = () => {
    this.oddMsgArray.push(this.oddMsgGroup(""));
  }

  removeOddMsg = (i: number) => {
    let text = this.oddMsgForm.get("text") as FormArray;
    text.removeAt(i);
  }

  //If form is valid, then add array to preview
  addOddMsgResp = () => {
    if (this.oddMsgForm.status === "VALID") {
      const msgsArray = this.reformatMsgs(this.oddMsgForm.value.text);
      this.onAddOddMsgResp.emit(msgsArray);
      this.resetForm();
    }
  }

  //Convert messages object into array
  reformatMsgs = (msgsObj: any) => {
    let msgsArray = [];
    for (let msg in msgsObj) {
      msgsArray.push(msgsObj[msg].text);
    }
    return msgsArray;
  }

  //If form is valid then add updated array to preview
  updateOddMsgResp = () => {
    if (this.oddMsgForm.status === "VALID") {
      const msgsArray = this.reformatMsgs(this.oddMsgForm.value.text);
      this.onUpdateOddMsgResp.emit(msgsArray);
      this.initForm();
    }
  }

}
