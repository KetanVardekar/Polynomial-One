import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  serviceId: any;
  botType: any;
  loginForm: FormGroup | any;
  actionArray: FormArray | any;
  @Output() onAddLoginResp = new EventEmitter<any>();
  @Output() onUpdateLoginResp = new EventEmitter<any>();
  @Input() update: any;
  @Input() selectedRC: any;
  @Input() set setLoginCardData(data: any) {
    //if data is not empty then populate form with it
    console.log(data);
    if (data && Object.keys(data).length !== 0 && data.constructor === Object) {
      this.populateForm(data);
    }
  }
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    if (!this.loginForm) {
      this.initForm();
    }
  }

  updateCard = () => {
    if (this.loginForm.status === "VALID") {
      const loginData = this.loginDataFormatter(this.loginForm.value);
      this.onUpdateLoginResp.emit(loginData);
      this.resetForm();
    }
  }

  addLoginAction = () => {
    console.log(this.actionArray.value);
    this.actionArray.push(this.actionGroup('', ''));
  }

  removeLoginAction = (i: number) => {
    this.actionArray.removeAt(i);
  }

  addLoginToPreview = () => {
    if (this.loginForm.status === "VALID") {
      const loginData = this.loginDataFormatter(this.loginForm.value);
      this.onAddLoginResp.emit(loginData);
      this.resetForm();
    }
  }

  loginDataFormatter = (data: any) => {
    const obj = {
      title: data.title,
      action: data.action.map((action: any) => {
        return {
          title: action.title,
          value: {
            data: action.value
          }
        }
      })
    }
    return obj;
  }

  initForm = () => {
    this.loginForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      action: new FormArray([this.actionGroup('', '')])
    });
    this.actionArray = this.loginForm.get('action') as FormArray;
  }

  populateForm = (data: any) => {
    console.log(data);
    this.loginForm = this.formBuilder.group({
      title: new FormControl(data.title, Validators.required),
      action: new FormArray([])
    });
    this.actionArray = this.loginForm.get('action') as FormArray;
    data.action.forEach((action: any, index: number) => {
      this.actionArray.push(this.actionGroup(action.title, action.value.data));
    });
  }

  resetForm = () => {
    this.loginForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      action: new FormArray([this.actionGroup('', '')])
    });
    this.actionArray = this.loginForm.get('action') as FormArray;
  }

  actionGroup(title: string, value: string): FormGroup {
    return new FormGroup({
      title: new FormControl(title, Validators.required),
      value: new FormControl(value, Validators.required)
    })
  }

}
