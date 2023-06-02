import { ISResponseLibraryService } from './../../../core/services/IS/ISresponseLibrary.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-property-details-form',
  templateUrl: './property-details-form.component.html',
  styleUrls: ['./property-details-form.component.scss']
})
export class PropertyDetailsFormComponent implements OnInit {

  serviceId: any;
  botType: any;
  @Input() type: any;
  pdForm: FormGroup | any;// Property Description Form
  piArray: FormArray | any;// Property Image Urls Array
  ldArray: FormArray | any;// Location Description Array
  hfArray: FormArray | any;// House Features Array
  convIndex: number | any; // Index of item in conversation array. Use this index to know which item in preview is being edited.
  isUpdate: boolean = false;// true: Show update button, false: show Add button
  constructor(private isResponseLibraryService: ISResponseLibraryService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    this.pdForm = this.formBuilder.group({
      propertyName: [null, Validators.required],
      propertyImageUrls: new FormArray([this.iuGroup()]),
      propertyDescription: [null, Validators.required],
      locationDescription: new FormArray([this.ldGroup()]),
      houseFeatures: new FormArray([this.hfGroup()])
    });
    // Property Image Urls Array
    this.piArray = this.pdForm.get('propertyImageUrls') as FormArray;
    // Location Description Array
    this.ldArray = this.pdForm.get('locationDescription') as FormArray;
    // House Features Array
    this.hfArray = this.pdForm.get('houseFeatures') as FormArray;

    this.isResponseLibraryService.get.subscribe(
      data => {

        if (data.action === "EDIT") {
          if (data && Object.keys(data).length === 0 && data.constructor === Object) {
            //Response is empty
            this.isUpdate = false;
          } else {

            let pd = data.payload.response;
            this.convIndex = data.convIndex;
            this.isUpdate = true;
            console.log("pd >>>>> ", pd);

            //Empty the Property image url (piu) array
            let piuArray = this.pdForm.get('propertyImageUrls') as FormArray;
            piuArray.clear();
            pd.propertyImageUrls.forEach((url: any) => {
              piuArray.push(new FormGroup({
                url: new FormControl(url, Validators.required)
              }));
            });

            // Empty the location description (ld) array
            let ldArray = this.pdForm.get('locationDescription') as FormArray;
            ldArray.clear();
            pd.locationDescription.forEach((ld: any) => {
              ldArray.push(new FormGroup({
                address: new FormControl(ld.address, Validators.required),
                iconUrl: new FormControl(ld.iconUrl, Validators.required)
              }));
            });

            // Empty the house feature (hf) array and push data to it
            let hfArray = this.pdForm.get('houseFeatures') as FormArray;
            hfArray.clear();
            pd.houseFeatures.forEach((hf: any, hfIndex: number) => {
              hfArray.push(new FormGroup({
                featureTitle: new FormControl(hf.featureTitle, Validators.required),
                description: new FormArray([])
              }));
              hf.description.forEach((hfd: any, hfdIndex: number) => {
                // Empty the house feature description (hfd) array and push data to it
                let hfdArray = hfArray.at(hfIndex).get('description') as FormArray;
                hfdArray.push(new FormGroup({
                  title: new FormControl(hfd.title, Validators.required),
                  value: new FormArray([])
                }));
                hfd.value.forEach((value: any, hfdvIndex: number) => {
                  // Empty the house feature description value (hfdv) array and push data to it
                  let hfdvArray = hfdArray.at(hfdIndex).get('value') as FormArray;
                  hfdvArray.push(new FormGroup({
                    value: new FormControl(value, Validators.required)
                  }));
                });
              });
            });

            this.pdForm.patchValue({
              propertyName: pd.propertyName,
              propertyDescription: pd.propertyDescription
            });
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //Image Urls form group
  iuGroup(): FormGroup {
    return new FormGroup({
      url: new FormControl('', Validators.required)
    })
  }

  //Location Description form group
  ldGroup(): FormGroup {
    return new FormGroup({
      address: new FormControl('', Validators.required),
      iconUrl: new FormControl('', Validators.required)
    })
  }

  //House Features form group
  hfGroup(): FormGroup {
    return new FormGroup({
      featureTitle: new FormControl('', Validators.required),
      description: new FormArray([this.hfdGroup()])
    })
  }

  //House Features Description form group
  hfdGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl('', Validators.required),
      value: new FormArray([this.hfdvGroup()])
    })
  }

  //House Features Description Value form group
  hfdvGroup(): FormGroup {
    return new FormGroup({
      value: new FormControl('', Validators.required)
    })
  }

  // Add image URL
  addUrl = () => {
    this.piArray.push(this.iuGroup());
  }

  // Add Location Description
  addLD = () => {
    this.ldArray.push(this.ldGroup());
  }

  // Add House Features
  addHF = () => {
    this.hfArray.push(this.hfGroup());
  }

  // Add House Feature Description
  addHFD = (index: number) => {
    let desc = this.hfArray.controls[index].get('description') as FormArray;
    desc.push(this.hfdGroup());
  }

  // Add House Feature Description Value
  addHFDV = (hfIndex: number, hfdIndex: number) => {
    let desc = this.hfArray.controls[hfIndex].get('description') as FormArray;
    let val = desc.controls[hfdIndex].get('value') as FormArray;
    val.push(this.hfdvGroup());
  }

  // Remove Image URL
  removeUrl = (index: number) => {
    this.piArray.removeAt(index);
  }

  removeLD = (index: number) => {
    this.ldArray.removeAt(index);
  }

  removeHF = (index: number) => {
    this.hfArray.removeAt(index);
  }

  removeHFD = (index: number) => {
    this.hfArray.removeAt(index);
  }

  removeHFDV = (hfIndex: number, hfdIndex: number, hfdvIndex: number) => {
    let desc = this.hfArray.controls[hfIndex].get('description') as FormArray;
    let val = desc.controls[hfdIndex].get('value') as FormArray;
    val.removeAt(hfdvIndex);
  }

  add = () => {
    let obj: any = {};
    let pd = { ...this.pdForm.value };
    if (this.pdForm.status === "VALID") {
      obj["propertyName"] = pd.propertyName;
      obj["propertyImageUrls"] = pd.propertyImageUrls.map((url: any) => url.url);
      obj["propertyDescription"] = pd.propertyDescription;
      obj["locationDescription"] = pd.locationDescription;


      pd.houseFeatures.forEach((hf: any) => {
        hf.description.forEach((hfd: any) => {
          hfd.value = hfd.value.map((value: any) => value.value);
        });
      });

      obj["houseFeatures"] = pd.houseFeatures;


      //call service with ADD
      this.isResponseLibraryService.addResp({ action: "ADD", payload: { type: this.type, response: obj } });
    }
  }

  update = () => {
    let obj: any = {};
    let pd = { ...this.pdForm.value };
    if (this.pdForm.status === "VALID") {
      obj["propertyName"] = pd.propertyName;
      obj["propertyImageUrls"] = pd.propertyImageUrls.map((url: any) => url.url);
      obj["propertyDescription"] = pd.propertyDescription;
      obj["locationDescription"] = pd.locationDescription;


      pd.houseFeatures.forEach((hf: any) => {
        hf.description.forEach((hfd: any) => {
          hfd.value = hfd.value.map((value: any) => value.value);
        });
      });

      obj["houseFeatures"] = pd.houseFeatures;


      //call service with ADD
      this.isResponseLibraryService.updateResp({ action: "UPDATE", payload: { type: this.type, response: obj }, convIndex: this.convIndex });
    }
  }


}
