import { OrganizationService } from './../../core/services/organization.service';
import { ISPublishService } from './../../core/services/IS/ISpublish.service';
import { ISIntentsService } from './../../core/services/IS/ISintents.service';
import { ISResponseLibraryService } from './../../core/services/IS/ISresponseLibrary.service';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LabelType, Options } from 'ng5-slider';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-add-edit-response-library',
  templateUrl: './add-edit-response-library.component.html',
  styleUrls: ['./add-edit-response-library.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(
          ':enter',
          stagger(100, [
            animate(
              '.3s ease-out',
              keyframes([
                style({ opacity: 0, transform: 'translateY(60px)' }),
                style({ opacity: 1, transform: 'translateY(0)' }),
              ])
            ),
          ]),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class AddEditResponseLibraryComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<any>();
  image: any
  downloadCard: any
  intentName: any;
  intentTypeId: any;
  serviceId: any;
  botType: any;
  botName: any;
  rangeArrayLength: any
  selectedSlot: any = '';
  selectedSlotType: any = '';
  responsesArray: Array<any> = [];
  entitiesArray: Array<any> = [];
  oddMsgsArr: Array<string> = [];
  slotsLoaded: boolean = false;
  globalResponse: boolean = false;
  conditionResponse: boolean = false;
  isFreeText: boolean = false;
  update: boolean = false;
  showUpdateButton: boolean = false; //if true then show update button otherwise show save button
  convIndex: number = -1; //index of the conversation preview row to be updated
  itemIndex: number = -1; //index of the conversation preview row item updated(e.g a single button in row)
  selectedRC: string = '';
  textResponse: boolean = false; //show hide text response block
  voiceResponse: boolean = false; //show hide voice response block
  textInput: any; //text response
  selectedStarValue: any; //for feedback card
  selectedStarIndex: number = -1; //for feedback card
  voiceInput: any; //voice response
  paragraphInput: any; //paragraph response
  messageInput: any; //message response
  greetingsInput: any; //message response
  responseTypeArray: Array<any> = [];
  intentsArray: Array<any> = [];
  pqrForm: FormGroup | any;
  tRespForm: FormGroup | any; //text response form
  vRespForm: FormGroup | any; //voice response form
  greetingsForm: FormGroup | any; //voice response form
  rqrForm: FormGroup | any;
  iqrForm: FormGroup | any;
  imForm: FormGroup | any;
  rangeItem: FormGroup | any;
  vrForm: FormGroup | any;
  dcForm: FormGroup | any;
  ticketForm: FormGroup | any;
  conditionForm: FormGroup | any;
  prevIntentForm: FormGroup | any;
  sliderForm: FormGroup | any;
  imageReplyForm: FormGroup | any;
  carouselForm: FormGroup | any;
  videoCarouselForm: FormGroup | any;
  irspForm: FormGroup | any;
  isNextDisabled = true
  isPreviewDisabled: boolean = false
  addedRange: any
  minValue: any
  slotForm: FormGroup | any;
  feedbackForm: FormGroup | any;
  sliderMin: number | any;
  rangeArray: FormArray | any;
  ticketArray: FormArray | any;
  carouselArray: FormArray | any;
  videoCarouselArray: FormArray | any;
  tTypeArray: FormArray | any;
  vTypeArray: FormArray | any;
  options: Options | any;
  responseFormat: any = [{ text: 'text' }];

  intent: any;
  slots: Array<any> = [];
  tagList: any = []
  intentId: any;
  userDefinedSlots: Array<any> = [];
  systemDefinedSlots: Array<any> = [];
  suggestions: boolean = true;
  response: boolean = true;
  responseId: any;
  submitted: boolean = false;
  addedLength: any
  conversationArray: Array<any> = [];

  //response lists

  pqrList: Array<any> = [];
  iqrList: Array<any> = [];
  rqrList: Array<any> = [];
  vrList: Array<any> = [];
  paragraphList: Array<any> = [];
  imageReplyList: Array<any> = [];
  carouselList: Array<any> = [];
  irspList: Array<any> = [];
  rcList: Array<string> = [];
  imList: Array<any> = [];
  starsArray: Array<any> = [];
  condUpdate: boolean = false;
  prevIntentUpdate: boolean = false;
  botIcon: any = "";
  maxValue: any
  loginCardData: any = {}; //used to store login card data which will be passed to login component for editing
  slideConfig = {
    variableWidth: true,
    dots: false,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    adaptiveHeight: false,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private isResponseLibraryService: ISResponseLibraryService,
    private iSPublishService: ISPublishService,
    private isIntentsService: ISIntentsService,
    private formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.intentName = this.activatedRoute.snapshot.params.intentName;
    this.intentTypeId = this.activatedRoute.snapshot.params.intentTypeId;

    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    this.botName = localStorage.getItem('botName');
    let botDetails: any = localStorage.getItem("botDetails")
    this.botIcon = JSON.parse(botDetails).avatarUri
    this.fetchRichCardsList();
    this.fetchIntent(this.intentName);
    this.fetchSlots();
    this.fetchIntents();
    this.fetchResponse();


    this.isResponseLibraryService.get.subscribe(
      (data) => {
        console.log('get response =====================>');
        console.log(data);
        // if type add?

        if (data.action === 'ADD') {
          this.addToConversation(data.payload.type, data.payload.response);
        } else if (data.action === 'REMOVE') {
          this.removeConversation(data.convIndex);
        } else if (data.action === 'EDIT') {
          this.editConv(data.payload, data.convIndex, 0);
        } else if (data.action === 'UPDATE') {
          let convIndex = data.convIndex;
          this.conversationArray[convIndex].response = data.payload.response;
          this.update = false;
          this.selectedRC = '';
          console.log("CONVARRAY", this.conversationArray);
        }
      },
      (error) => {
        console.log(error);
      }
    );

    //Ticket card form

    this.ticketForm = this.formBuilder.group({
      items: new FormArray([this.ticketGroup()]),
    });

    //Plain Quick Reply form
    this.pqrForm = this.formBuilder.group({
      textInput: [null, Validators.required],
      valueInput: [null, Validators.required],
    });

    //Rounded Quick Reply form
    this.rqrForm = this.formBuilder.group({
      textInput: [null, Validators.required],
      valueInput: [null, Validators.required],
    });

    this.feedbackForm = this.formBuilder.group({
      title: [null, Validators.required],
      min: [null, Validators.required],
      max: [null, Validators.required],
    });

    this.conditionForm = this.formBuilder.group({
      textInput: [null, Validators.required],
      isFreeText: [false, Validators.required],
    });

    this.prevIntentForm = this.formBuilder.group({
      textInput: ['', Validators.required],
    });

    //Icon Quick Reply form
    this.iqrForm = this.formBuilder.group({
      icon: [null, Validators.required],
      textInput: [null, Validators.required],
      valueInput: [null, Validators.required],
    });
    // this.dcForm.valueChanges.subscribe((v: any) => {
    //   this.isNextDisabled = !this.dcForm.valid;
    // });
    //Icon message form
    this.imForm = this.formBuilder.group({
      icon: [null, Validators.required],
      message: [null, Validators.required],
    });

    //Image response
    this.irspForm = this.formBuilder.group({
      image: [null, Validators.required],
    });
    this.irspForm.valueChanges.subscribe((v: any) => {
      this.isNextDisabled = !this.irspForm.valid;
    });

    //Image reply form
    this.imageReplyForm = this.formBuilder.group({
      image: [null, Validators.required],
      textInput: [null, Validators.required],
      valueInput: [null, Validators.required],
    });

    //Carousel form
    this.carouselForm = this.formBuilder.group({
      data: new FormArray([this.carouselDataGroup()]),
    });

    //new Video Carousel Form
    this.videoCarouselForm = this.formBuilder.group({
      data: new FormArray([this.videoCarouselDataGroup()]),
    })
    //Vote form
    // this.voteForm = this.formBuilder.group({
    //   text: [null, Validators.required],
    //   value: [null, Validators.required]
    // });

    // Download Card
    this.dcForm = this.formBuilder.group({
      message: [null],
      title: [null, Validators.required],
      file: [null, Validators.required],
    });
    this.dcForm.valueChanges.subscribe((v: any) => {
      this.isNextDisabled = !this.dcForm.valid;
    });
    //Visual reply
    this.vrForm = this.formBuilder.group({
      image: [null, Validators.required],
      imagePosition: ['', Validators.required],
      text: [null, Validators.required],
    });

    this.slotForm = this.formBuilder.group({
      slotName: ['', Validators.required],
    });

    this.sliderForm = this.formBuilder.group({
      title: ['', Validators.required],
      min: ['', Validators.required],
      max: ['', Validators.required],
      range: new FormArray([this.rangeGroup()]),
    });
    //  this.sliderForm.valueChanges.subscribe((v:any)=>{
    //     this.isPreviewDisabled =! this.sliderForm.valid
    //   })}
    this.sliderForm.valueChanges.subscribe((res: any) => {
      this.isPreviewDisabled = !this.sliderForm.valid
    })

    this.rangeItem = this.formBuilder.group({
      rangeTitle: ['', Validators.required],
      rangeValue: ['', Validators.required],
    })
    this.tRespForm = this.formBuilder.group({
      type: new FormArray([]),
    });

    this.vRespForm = this.formBuilder.group({
      type: new FormArray([]),
    });

    this.rangeArray = this.sliderForm.get('range') as FormArray;
    this.tTypeArray = this.tRespForm.get('type') as FormArray;
    this.vTypeArray = this.vRespForm.get('type') as FormArray;
    this.ticketArray = this.ticketForm.get('items') as FormArray;
    this.carouselArray = this.carouselForm.get('data') as FormArray;
    this.videoCarouselArray = this.videoCarouselForm.get('data') as FormArray;

    this.sliderMin = this.sliderForm.get('min').value;
  }

  numericOnly(event: any): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
  clearSlotForm() {
    this.slotForm.reset({
      slotName: '',
    });
  }

  removeLoginCard = (i: number) => {
    this.conversationArray.splice(i, 1);
  };

  editLoginCard = (i: number) => {
    const { response, type } = this.conversationArray[i];
    this.loginCardData = response;
    this.selectedRC = type;
    this.update = true;
    this.convIndex = i;
  };

  clearTicketForm = () => {
    this.ticketForm = this.formBuilder.group({
      items: new FormArray([this.ticketGroup()]),
    });
    this.ticketArray = this.ticketForm.get('items') as FormArray;
  };

  clearCarouselForm = () => {
    this.carouselForm = this.formBuilder.group({
      data: new FormArray([this.carouselDataGroup()]),
    });
    this.carouselArray = this.carouselForm.get('data') as FormArray;
  };

  clearVideoCarouselForm = () => {
    this.videoCarouselForm = this.formBuilder.group({
      data: new FormArray([this.videoCarouselDataGroup()]),
    });
    this.videoCarouselArray = this.videoCarouselForm.get('data') as FormArray;
  };

  addLoginResp = (loginFormData: any) => {
    this.addToConversation(this.selectedRC, loginFormData);
    //this.clearListForm();
    this.update = false;
    this.selectedRC = '';
  };

  updateLoginResp = (loginFormData: any) => {
    this.conversationArray[this.convIndex].response = loginFormData;
    this.update = false;
    this.selectedRC = '';
  };

  addCarouselData = () => {
    this.carouselArray.push(this.carouselDataGroup());
  };
  addVideoCarouselData = () => {
    this.videoCarouselArray.push(this.videoCarouselDataGroup());
  }

  addCarouselDesc = (index: number) => {
    let action = this.carouselArray.controls[index].get(
      'description'
    ) as FormArray;
    action.push(this.carouselDescriptionGroup());
  };

  rangeGroup(): FormGroup {
    return new FormGroup({
      rangeTitle: new FormControl('', Validators.required),
      rangeValue: new FormControl('', Validators.required),
    });
  }

  dataGroup(): FormGroup {
    return new FormGroup({
      key: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
    });
  }

  attachmentGroup(): FormGroup {
    return new FormGroup({
      file: new FormControl('', Validators.required),
    });
  }

  actionGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
    });
  }

  ticketGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl('', Validators.required),
      action: new FormArray([]),
      // attachment: new FormArray([
      //   this.attachmentGroup()
      // ]),
      data: new FormArray([this.dataGroup()]),
    });
  }

  carouselDescriptionGroup(): FormGroup {
    return new FormGroup({
      informationType: new FormControl('', Validators.required),
      displayValue: new FormControl('', Validators.required),
    });
  }

  carouselDataGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl('', Validators.required),
      subtitle: new FormControl('', Validators.required),
      imageURL: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      description: new FormArray([this.carouselDescriptionGroup()]),
    });
  }

  videoCarouselDataGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      thumbnail: new FormControl(null, Validators.required),
      videoUrl: new FormControl(null, Validators.required),
      videoSize: new FormControl(null),
      tagName: new FormControl(null),
      tags: new FormArray([]),
      tagList:new FormArray([])
    });
  }

  rTypeGroup(responseType: any): FormGroup {
    return new FormGroup({
      responseType: new FormControl(responseType, Validators.required),
      text: new FormControl(null, Validators.required),
    });
  }
  maxChange() {
    this.maxValue = this.sliderForm.get('max').value

  }
  minChange() {
    this.minValue = this.sliderForm.get('min').value
    console.log(this.minValue)
  }
  addRange() {

    (this.sliderForm.get('range') as FormArray).push(this.rangeGroup())
    this.addedLength = this.sliderForm.get('range').value.length
    console.log(this.addedLength)

  }
  removeSlider(i: number) {
    this.rangeArrayLength = this.rangeArray.controls.splice(i, 1);
  }

  removeRange() {
    (this.sliderForm.get('range') as FormArray).controls.pop();
  }

  // selectRC = (e) => {
  //   this.selectedRC = e.target.value;
  //   console.log(this.selectedRC);
  // }

  selectionChanged = (e: any) => {
    console.log(e.target.value);
    this.vrForm.patchValue({ imagePosition: e.target.value });
  };

  selectStar = (starArr: any, i: number) => {
    this.selectedStarValue = starArr[i].value;
    this.selectedStarIndex = i;
  };

  boundary = (value: string) => {
    console.log(value);
    let min = this.feedbackForm.get('min').value;
    let max = this.feedbackForm.get('max').value;
    if (min <= 0) {
      this.feedbackForm.patchValue({ min: 1 });
    }
    if (min && max && min >= max) {
      this.feedbackForm.patchValue({ max: min + 1 });
    }

    //populate rating array with default values
    this.starsArray = [];
    for (let i = min; i <= max; i++) {
      let obj = {
        input: i,
        value: '',
      };
      this.starsArray.push(obj);
    }
  };

  generateArray(number: number): any {
    if (!isNaN(number) && number >= 0) {
      return new Array(number);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.slotForm.controls;
  }

  addSlot() {
    let slotName = this.slotForm.get('slotName').value;
    let i = this.slots.indexOf(slotName);
    if (i == -1) {
      this.slots.push(slotName);
    }
    this.clearSlotForm();
  }

  upload = (e: any, type?: any, i?: any) => {
    this.ngxService.start();

    console.log(e.target.files[0])
    let files = e.target.files;
    if (files.length > 0) {
      let file = files[0];

      let formData = new FormData();
      formData.append('file', file);

      this.organizationService.fileUpload(formData).subscribe(
        (data) => {
          this.toastr.success(data.message);
          switch (type) {
            case 'video':
              this.videoCarouselArray.controls[i].patchValue({ videoUrl: data.data.url });
              this.videoCarouselArray.controls[i].patchValue({ videoSize: data.data.size });
              break;

            case 'thumbnail':
              this.videoCarouselArray.controls[i].patchValue({ thumbnail: data.data.url });
              break;
          }
          this.iqrForm.patchValue({ icon: data.data.url });
          this.imForm.patchValue({ icon: data.data.url });
          this.irspForm.patchValue({ image: data.data.url });
          this.dcForm.patchValue({ file: data.data.url });
          this.imageReplyForm.patchValue({ image: data.data.url });
          this.ngxService.stop();
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
    }
  };

  uploadList = (e: any, i: number) => {
    let files = e.target.files;
    if (files.length > 0) {
      let file = files[0];

      let formData = new FormData();
      formData.append('file', file);

      this.organizationService.fileUpload(formData).subscribe(
        (data) => {
          // this.listArray.at(i).patchValue({ url: data.url });
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    }
  };

  addImageReply = () => {
    let image = this.imageReplyForm.get('image').value;
    let text = this.imageReplyForm.get('textInput').value;
    let value = this.imageReplyForm.get('valueInput').value;
    if (
      image &&
      image.trim() != '' &&
      text &&
      text.trim() != '' &&
      value &&
      value.trim() != ''
    ) {
      let obj = {
        imageUrl: image,
        text: text,
        value: value,
      };
      this.imageReplyList.push(obj);
      this.imageReplyForm.reset();
    }
  };

  updateImageReply = () => {
    let obj: any = {};
    let image = this.imageReplyForm.get('image').value;
    let text = this.imageReplyForm.get('textInput').value;
    let value = this.imageReplyForm.get('valueInput').value;

    obj = {
      imageUrl: image,
      text: text,
      value: value,
    };

    this.conversationArray[this.convIndex].response[this.itemIndex] = obj;
    this.imageReplyForm.reset();
    this.update = false;
    this.selectedRC = '';
  };

  addIRsp = () => {
    this.ngxService.start();

    this.addToConversation(this.selectedRC, '');
    this.ngxService.stop();
  };

  addTicketToPreview = () => {
    console.log(this.selectedRC);
    console.log(this.ticketForm);
    if (this.ticketForm.status === 'VALID') {
      this.addToConversation(this.selectedRC, this.ticketForm.value);
    }
  };

  updateIRsp = () => {
    let imageUrl = this.irspForm.get('image').value;
    this.conversationArray[this.convIndex].response.imageUrl = imageUrl;
    this.selectedRC = '';
    this.irspForm.reset();
    this.update = false;
  };

  updateVisualReply = () => {
    let obj: any = {};
    let image = this.vrForm.get('image').value;
    let imagePosition = this.vrForm.get('imagePosition').value;
    let text = this.vrForm.get('text').value;

    obj = {
      imageUrl: image,
      imagePosition: imagePosition,
      text: text,
    };
    this.conversationArray[this.convIndex].response = obj;
    this.vrForm.reset();
    this.update = false;
    this.selectedRC = '';
  };
  addTag(i: any) {
    if (this.videoCarouselArray.controls[i].get('tagName').value) {
      let tagArray = (this.videoCarouselArray.controls[i].get(
        'tags'
      ) as FormArray)
      tagArray.value.push(this.videoCarouselArray.controls[i].get('tagName').value);
      this.videoCarouselArray.controls[i].patchValue({ tagName: '' });
    }
  }
  addToConversation = (type: string, response: any) => {
    //Reformat form data and add to preview
    let obj: any = {
      type: type,
    };
    if (type == 'Visual Reply') {
      let image = this.vrForm.get('image').value;
      let imagePosition = this.vrForm.get('imagePosition').value;
      let text = this.vrForm.get('text').value;

      obj.response = {
        imageUrl: image,
        imagePosition: imagePosition,
        text: text,
      };
      this.vrForm.reset();
    }
    else if (type == 'Download Card') {
      let message = this.dcForm.get('message').value;
      let title = this.dcForm.get('title').value;
      let file = this.dcForm.get('file').value;

      obj.response = [{
        message: message,
        title: title,
        url: file
      }];
      this.dcForm.reset();
    }

    else if (type == 'Image Response') {
      let image = this.irspForm.get('image').value;

      obj.response = {
        imageUrl: image,
      };
    } else if (type == 'Slider') {
      let title = this.sliderForm.get('title').value;
      let min = this.sliderForm.get('min').value;
      let max = this.sliderForm.get('max').value;
      let range = this.sliderForm.get('range').value;

      obj.response = {
        sliderTitle: title,
        sliderMaxRange: max,
        sliderMinRange: min,
        data: range,
      };

      obj.options = {
        floor: min,
        ceil: max,
      };
      obj.title = title;
      obj.range = range;

      this.options = {
        floor: min,
        ceil: max,
        translate: (value: number, label: LabelType): string => {
          switch (label) {
            case LabelType.Floor:
              return value + '';
            case LabelType.Ceil:
              return value + '';
            default:
              return this.getRangeValue(value);
          }
        },
      };

      this.sliderForm.reset();
    } else if (type == 'Feedback Card') {
      console.log(this.feedbackForm);
      console.log(this.starsArray);

      let title = this.feedbackForm.get('title').value;
      let min = this.feedbackForm.get('min').value;
      let max = this.feedbackForm.get('max').value;

      obj.response = {
        title: title,
        minValue: min,
        maxValue: max,
        data: this.starsArray,
      };

      this.selectedStarValue = this.starsArray[0].value;
      this.feedbackForm.reset();
      this.starsArray = [];
    } else if (type == 'Paragraph' || type == 'Message' || type == "Greetings Card") {
      obj.response = {
        text: response,
      };
    } else {
      obj.response = response;
    }

    this.pushToConvArray(obj, type);

    this.clearTicketForm();

    this.pqrList = [];
    this.rqrList = [];
    this.iqrList = [];
    this.imList = [];
    this.imageReplyList = [];
    this.selectedRC = '';
    console.log(this.conversationArray);
    this.conversationArray.filter((ele: any) => {
      // ele.response.tags.find((res:any)=>{
      //   console.log(res)
      // })
      console.log(ele.response.tags)
    })
  };
  downloadMyFile() {
    this.conversationArray.filter((ele: any) => {
      if (ele.type == 'Download Card') {
        this.downloadCard = ele.response[0]?.url?ele.response[0].url:ele.respons.url
      }
    })
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', this.downloadCard);
    link.setAttribute('download', `file.doc`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  deleteTag(index: any) {
    this.tagList.splice(index, 1);
    console.log(this.tagList)
  }
  updateFeedbackCard = () => {
    let feedback = this.feedbackForm.value;
    let obj = {
      title: feedback.title,
      minValue: feedback.min,
      maxValue: feedback.max,
      data: this.starsArray,
    };
    this.conversationArray[this.convIndex].response = obj;
    this.selectedStarValue = this.starsArray[0].value;
    this.feedbackForm.reset();
    this.update = false;
    this.selectedRC = '';
  };

  pushToConvArray = (obj: any, type: string) => {
    if (this.globalResponse) {
      if (this.conversationArray.length === 0) {
        if (type === 'condition') {
          // do nothing
        } else if (type === 'prevIntent') {
          this.conversationArray.push(obj);
          let obj1 = {
            type: 'condition',
            response: {
              text: 'Default response',
              isFreeText: false,
            },
          };
          //indicate that this is default response
          this.conversationArray.push(obj1);
        } else {
          this.conversationArray.push(obj);
        }
      } else {
        if (type === 'condition') {
          if (
            this.conversationArray[this.conversationArray.length - 1].type ===
            'condition'
          ) {
            //do nothing
          } else {
            this.conversationArray.push(obj);
          }
        } else if (type === 'prevIntent') {
          if (
            this.conversationArray[this.conversationArray.length - 1].type ===
            'condition'
          ) {
            //do nothing
          } else {
            this.conversationArray.push(obj);
            let obj1 = {
              type: 'condition',
              response: {
                text: 'Default response',
                isFreeText: false,
              },
            };
            //indicate that this is default response
            this.conversationArray.push(obj1);
          }
        } else {
          this.conversationArray.push(obj);
        }
      }
    } else if (!this.conditionResponse) {
      this.conversationArray.push(obj);
    } else {
      if (this.conversationArray.length === 0) {
        if (type === 'condition') {
          // do nothing
        } else {
          let obj1 = {
            type: 'condition',
            response: {
              text: 'Default response',
              isFreeText: false,
            },
          };
          this.conversationArray.push(obj1);
          this.conversationArray.push(obj);
        }
      } else {
        if (type === 'condition') {
          if (
            this.conversationArray[this.conversationArray.length - 1].type ===
            'condition'
          ) {
            //do nothing
          } else {
            this.conversationArray.push(obj);
          }
        } else {
          this.conversationArray.push(obj);
        }
      }
    }
  };

  getRangeValue(number: any) {
    return Math.round(number / 1000) + 'k';
  }

  addSlider = () => {
    if (this.sliderForm.valid) {
      this.addToConversation(this.selectedRC, '');
      this.clearSliderForm();
    }
  };

  deleteResponse = async () => {
    console.log('delete response', this.responseId, this.intentName);
    this.ngxService.start();
    let payload = {
      id: this.responseId,
      intentName: this.intentName,
    };
    if (this.showUpdateButton) {
      // let botStatus = await this.checkBotStatus(null);
      // if (!botStatus) {
      //   return false;
      // }
      this.isResponseLibraryService
        .deleteResponse(this.botType, this.serviceId, payload)
        .subscribe(
          (data) => {
            this.toastr.success(data.message);
            this.fetchResponse();
            this.resetAllForms();
            this.ngxService.stop();
          },
          (error) => {
            this.toastr.error(error.error.message);
          }
        );
    } else {
      this.conversationArray = [];
    }
  };

  updateSlider = () => {
    console.log(this.selectedRC);
    let payload: any = this.formatPreview();
    payload.id = this.intentId;

    let title = this.sliderForm.get('title').value;
    let min = this.sliderForm.get('min').value;
    let max = this.sliderForm.get('max').value;
    let range = this.sliderForm.get('range').value;

    const options = {
      floor: min,
      ceil: max,
    };

    this.conversationArray[this.convIndex].options = options;
    this.conversationArray[this.convIndex].title = title;
    this.conversationArray[this.convIndex].response.data = range;
    this.conversationArray[this.convIndex].response.sliderTitle = title;
    this.conversationArray[this.convIndex].response.sliderMaxRange = max;
    this.conversationArray[this.convIndex].response.sliderMinRange = min;
    this.sliderForm.reset();
    this.update = false;
    this.selectedRC = '';

    // this.responseLibraryService.updateResponse(payload).subscribe((data) => {
    //   this.toastr.success(data.message);
    //   this.fetchResponse();
    // }, (error) => {
    //   this.toastr.error(error.error.message);
    //   console.log(error);
    // });
    console.log(this.conversationArray);
    console.log('update response');
    console.log('update slider');
  };

  addResponse = async () => {
    // let botStatus = await this.checkBotStatus(null);
    // if (!botStatus) {
    //   return false;
    // }

    this.textResponse = false;
    this.voiceResponse = false;
    this.ngxService.start()
    let payload: any = this.formatPreview();

    console.log(this.conversationArray);
    payload = JSON.stringify(payload);
    payload = JSON.parse(payload);
    console.log(payload);
    this.isResponseLibraryService
      .insertResponse(this.botType, payload)
      .subscribe(
        (data) => {
          console.log(data);
          this.toastr.success(data.message);
          this.fetchResponse();
          this.ngxService.stop()
        },
        (error) => {
          this.toastr.error(error.error.message);
          console.log(error);
        }
      );
  };

  updateResponse = async () => {
    // let botStatus = await this.checkBotStatus(null);
    // if (!botStatus) {
    //   return false;
    // }

    let payload: any = this.formatPreview();
    if (!payload.hasOwnProperty('conditionedResponses')) {
      payload['conditionedResponses'] = [];
    }
    payload.id = this.intentId;
    console.log(payload);
    this.ngxService.start()
    this.isResponseLibraryService
      .updateResponse(this.botType, payload)
      .subscribe(
        (data) => {
          this.toastr.success(data.message);
          this.fetchResponse();
          this.ngxService.stop()
        },
        (error) => {
          this.toastr.error(error.error.message);
          console.log(error);
        }
      );
    console.log('update response');
  };

  formatPreview = () => {
    let payload1: any = {
      intentName: this.intentName,
      isSlotPresent: false,
      globalIntent: this.globalResponse,
      isFreeText: this.isFreeText,
      slotsAdded: [],
      textResponse: [],
      voiceResponse: [],
      richCardDetails: [],
      intentBasedResponses: [],
      conditionedResponses: [],
    };

    if (this.selectedSlot) {
      payload1['isSlotPresent'] = true;
      payload1['slotsAdded'] = [
        {
          slotType: this.selectedSlotType,
          slotValue: this.selectedSlot,
        },
      ];
    }

    console.log(this.conversationArray);

    let freeTextCondition = [];

    if (this.globalResponse) {
      for (let i = 0; i < this.conversationArray.length; i++) {
        let item = this.conversationArray[i];
        if (item['type'] == 'prevIntent') {
          let obj1 = {
            prevIntent: item.response,
            conditionedResponses: [],
          };
          payload1['intentBasedResponses'].push(obj1);
          continue;
        } else if (item['type'] == 'Text') {
          payload1['textResponse'].push(item.response);
          continue;
        } else if (item['type'] == 'Voice') {
          payload1['voiceResponse'].push(item.response);
          continue;
        } else if (item['type'] == 'condition') {
          if (item.response.isFreeText) {
            freeTextCondition.push(item.response.text);
            this.isFreeText = true;
          }

          let obj1 = {
            conditionType: item.response.text,
            conditionValue: [],
          };
          let intentCount = payload1['intentBasedResponses'].length - 1;
          payload1['intentBasedResponses'][intentCount][
            'conditionedResponses'
          ].push(obj1);
          continue;
        } else {
          let intentCount = payload1['intentBasedResponses'].length - 1;
          let lastIntent = payload1['intentBasedResponses'][intentCount];

          let conditionsCount = lastIntent['conditionedResponses'].length - 1;
          let lastCondition =
            lastIntent['conditionedResponses'][conditionsCount][
            'conditionValue'
            ];

          let obj: any = {};

          obj['type'] = item.type;

          if (item.type == 'Slider') {
            obj['value'] = item.response;
          } else if (item.type == 'Paragraph') {
            obj['value'] = {
              data: [{ text: item.response.text }],
            };
          } else if (item.type == 'Login Card') {
            obj['value'] = item.response;
          } else if (item.type == 'Odd Messages') {
            obj['value'] = item.response;
          } else if (item.type == 'Message' || item.type == "Greetings Card") {
            obj['value'] = item.response.text;
          } else if (item.type == 'List View') {
            let lv = {
              title: item.response.title,
              url: item.response.url,
              data: [
                {
                  values: item.response.values,
                },
              ],
            };
            obj['value'] = lv;
          } else {
            obj['value'] = {
              data: item.response,
            };
          }

          lastCondition.push(obj);
        }
      }
    } else if (!this.conditionResponse) {
      for (let i = 0; i < this.conversationArray.length; i++) {
        let item = this.conversationArray[i];
        if (item['type'] == 'Text') {
          payload1['textResponse'].push(item.response);
          continue;
        } else if (item['type'] == 'Voice') {
          payload1['voiceResponse'].push(item.response);
          continue;
        } else {
          let obj: any = {};

          obj['type'] = item.type;

          if (item.type == 'Slider') {
            obj['value'] = item.response;
          } else if (item.type == 'Paragraph') {
            obj['value'] = {
              data: [{ text: item.response.text }],
            };
          } else if (item.type == 'Message' || item.type == "Greetings Card") {
            obj['value'] = item.response.text;
          } else if (item.type == 'Login Card') {
            obj['value'] = item.response;
          } else if (item.type == 'Odd Messages') {
            obj['value'] = item.response;
          } else if (item.type == 'List View') {
            let lv = {
              title: item.response.title,
              url: item.response.url,
              data: [
                {
                  values: item.response.values,
                },
              ],
            };
            obj['value'] = lv;
          } else {
            obj['value'] = {
              data: item.response,
            };
          }
          payload1['richCardDetails'].push(obj);
        }
      }
    } else {
      for (let i = 0; i < this.conversationArray.length; i++) {
        let item = this.conversationArray[i];
        if (item['type'] == 'condition') {
          if (item.response.isFreeText) {
            freeTextCondition.push(item.response.text);
            this.isFreeText = true;
          }
          let obj1 = {
            conditionType: item.response.text,
            conditionValue: [],
          };
          payload1['conditionedResponses'].push(obj1);
          continue;
        } else if (item['type'] == 'Text') {
          payload1['textResponse'].push(item.response);
          continue;
        } else if (item['type'] == 'Voice') {
          payload1['voiceResponse'].push(item.response);
          continue;
        } else {
          let conditionsCount = payload1['conditionedResponses'].length - 1;
          let lastCondition =
            payload1['conditionedResponses'][conditionsCount]['conditionValue'];

          let obj: any = {};

          obj['type'] = item.type;

          if (item.type == 'Slider') {
            obj['value'] = item.response;
          } else if (item.type == 'Paragraph') {
            obj['value'] = {
              data: [{ text: item.response.text }],
            };
          } else if (item.type == 'Message' || item.type == "Greetings Card") {
            obj['value'] = item.response.text;
          } else if (item.type == 'Login Card') {
            obj['value'] = item.response;
          } else if (item.type == 'Odd Messages') {
            obj['value'] = item.response;
          } else if (item.type == 'List View') {
            let lv = {
              title: item.response.title,
              url: item.response.url,
              data: [
                {
                  values: item.response.values,
                },
              ],
            };
            obj['value'] = lv;
          } else {
            obj['value'] = {
              data: item.response,
            };
          }

          lastCondition.push(obj);
        }
      }
    }
    if (this.isFreeText) {
      payload1['freeTextCondition'] = [...new Set(freeTextCondition)];
      payload1['isFreeText'] = this.isFreeText;
    }

    console.log(payload1);
    return payload1;
  };
  addTextResponse = () => {
    if (this.textInput.trim() != '') {
      this.addToConversation('Text', this.textInput);
      this.textInput = '';
      this.voiceInput = '';
      this.textResponse = false;
      this.voiceResponse = false;
    }
  };
  updateTextResponse = () => {
    if (this.textInput.trim() != '') {
      let obj: any = {
        type: 'Text',
        response: this.textInput,
      };
      this.conversationArray.splice(this.convIndex, 1, obj);
      this.textInput = '';
      this.voiceInput = '';
      this.update = false;
      this.textResponse = false;
      this.voiceResponse = false;
    }
  };

  resetAllForms = () => {
    //reset all forms
    this.condUpdate = false;

    this.paragraphInput = '';
    this.messageInput = '';
    this.textInput = '';
    this.voiceInput = '';
    this.greetingsInput = '';
    this.textResponse = false;
    this.voiceResponse = false;

    this.clearTicketForm();
    this.paragraphInput = '';
    // this.greetingsForm.reset();
    this.pqrForm.reset();
    this.tRespForm.reset();
    this.vRespForm.reset();
    this.rqrForm.reset();
    this.iqrForm.reset();
    this.imForm.reset();
    // this.vrForm.reset();
    this.conditionForm.reset();
    this.imageReplyForm.reset();
    this.carouselForm.reset();
    //this.listForm.reset();
    this.irspForm.reset();
    this.slotForm.reset();
    this.feedbackForm.reset();
    this.loginCardData = {};

    this.clearSliderForm();
    this.resetPrevIntentForm();
    this.clearVideoCarouselForm();
    this.prevIntentUpdate = false;
  };

  clearSliderForm = () => {
    this.sliderForm = this.formBuilder.group({
      title: ['', Validators.required],
      min: ['', Validators.required],
      max: ['', Validators.required],
      range: new FormArray([]),
    });
    this.rangeArray = this.sliderForm.get('range') as FormArray;
    this.starsArray = [];
  };

  editConv = (conv: any, convIndex: number, itemIndex: number) => {
    console.log('conversation >> ', conv);
    let { type, response } = conv;
    this.convIndex = convIndex;
    this.itemIndex = itemIndex;
    this.update = true;

    this.resetAllForms();
    switch (type) {
      case 'Text':
        {
          this.textResponse = true;
          this.voiceResponse = false;
          this.textInput = response;
        }
        break;
      case 'Voice':
        {
          this.textResponse = false;
          this.voiceResponse = true;
          this.voiceInput = response;
        }
        break;
      case 'Paragraph':
        {
          this.selectedRC = 'Paragraph';
          this.paragraphInput = response.text;
        }
        break;
      case 'condition':
        {
          this.update = false;
          this.condUpdate = true;
          this.conditionForm.patchValue({
            textInput: response.text,
            isFreeText: response.isFreeText,
          });
        }
        break;
      case 'prevIntent':
        {
          this.update = false;
          this.prevIntentUpdate = true;
          this.prevIntentForm.patchValue({ textInput: response });
        }
        break;
      case 'Message':
        {
          this.selectedRC = 'Message';
          this.messageInput = response.text;
        }
        break;
      case 'Greetings Card':
        {
          this.selectedRC = 'Greetings Card';
          this.greetingsInput = response.text;
        }
        break;

      case 'Download Card':
        {
          this.selectedRC = 'Download Card';
          this.dcForm.patchValue({
            title: response[0]?.title?response[0].title:response.title,
            message: response[0]?.message?response[0].message:response.message,
            file: response[0]?.url?response[0].url:response.url
          })
        }
        break;
      case 'Plain Quick Reply':
        {
          this.selectedRC = 'Plain Quick Reply';
          let text = response[itemIndex].text;
          let value = response[itemIndex].value;
          this.pqrForm.patchValue({ textInput: text, valueInput: value });
        }
        break;
      case 'Icon Quick Reply':
        {
          this.selectedRC = 'Icon Quick Reply';
          let iconUrl = response[itemIndex].iconUrl;
          let text = response[itemIndex].text;
          let value = response[itemIndex].value;
          this.iqrForm.patchValue({
            icon: iconUrl,
            textInput: text,
            valueInput: value,
          });
        }
        break;
      case 'Rounded Quick Reply':
        {
          this.selectedRC = 'Rounded Quick Reply';
          let text = response[itemIndex].text;
          let value = response[itemIndex].value;
          this.rqrForm.patchValue({
            textInput: text,
            valueInput: value,
          });
        }
        break;

      case 'Video Carousal':
        this.selectedRC = 'Video Carousal';
        this.videoCarouselArray.clear();
        conv.response.forEach((vcarousel: any, index: number) => {
          // const taglist = vcarousel.tags?vcarousel.tags.spilt(','):[]
          let data: FormArray = this.videoCarouselForm.get('data') as FormArray;
          let videoCarouselFormNew: any = new FormGroup({
            title: new FormControl(vcarousel.title ? vcarousel.title : '', Validators.required),
            description: new FormControl(vcarousel.description ? vcarousel.description : '', Validators.required),
            thumbnail: new FormControl(vcarousel.thumbnailUrl ? vcarousel.thumbnailUrl : '', Validators.required),
            videoUrl: new FormControl(vcarousel.videoUrl ? vcarousel.videoUrl : '', Validators.required),
            videoSize: new FormControl(vcarousel.videoSize ? vcarousel.videoSize : ''),
            tagName: new FormControl(null),
            tags: new FormControl(vcarousel.tags?vcarousel.tags.split(','):[]),
          });
          data.push(videoCarouselFormNew);
        })

        break;
      case 'Carousel':
        {
          this.selectedRC = 'Carousel';
          this.carouselArray.clear();
          conv.response.forEach((carousel: any, index: number) => {
            let data: FormArray = this.carouselForm.get('data') as FormArray;
            let desc: any = [];
            carousel.description.forEach((description: any, index: number) => {
              desc.push(
                new FormGroup({
                  informationType: new FormControl(
                    description.informationType,
                    Validators.required
                  ),
                  displayValue: new FormControl(
                    description.displayValue,
                    Validators.required
                  ),
                })
              );
            });
            let carouselForm = new FormGroup({
              title: new FormControl(carousel.title, Validators.required),
              subtitle: new FormControl(carousel.subtitle, Validators.required),
              imageURL: new FormControl(carousel.imageURL, Validators.required),
              value: new FormControl(carousel.value, Validators.required),
              description: new FormArray(desc),
            });
            data.push(carouselForm);
          });
        }
        break;
      case 'Slider':
        {
          this.selectedRC = 'Slider';
          console.log(conv);
          console.log(convIndex);
          console.log(itemIndex);
          this.sliderForm.patchValue({
            title: conv.title,
            min: conv.options.floor,
            max: conv.options.ceil,
          });
          for (let i = 0; i < conv.response.data.length; i++) {
            const rangeItem = conv.response.data[i];
            this.rangeArray.push(
              new FormGroup({
                rangeTitle: new FormControl(
                  rangeItem.rangeTitle,
                  Validators.required
                ),
                rangeValue: new FormControl(
                  rangeItem.rangeValue,
                  Validators.required
                ),
              })
            );
          }
        }
        break;
      case 'Visual Reply':
        {
          this.selectedRC = 'Visual Reply';
          let imageUrl = response.imageUrl;
          let imagePosition = response.imagePosition;
          let text = response.text;
          this.vrForm.patchValue({
            image: imageUrl,
            imagePosition: imagePosition,
            text: text,
          });
        }
        break;
      case 'Feedback Card':
        {
          this.selectedRC = 'Feedback Card';
          console.log(conv);
          const { title, maxValue, minValue, data } = conv.response;
          this.feedbackForm.patchValue({
            title: title,
            min: minValue,
            max: maxValue,
          });
          this.starsArray = data;
        }
        break;
      case 'Property View Card':
        {
          this.selectedRC = 'Property View Card';
        }
        break;
      case 'List View Card':
        {
          this.selectedRC = 'List View Card';
        }
        break;
      case 'Image Reply':
        {
          this.selectedRC = 'Image Reply';
          let imageUrl = response[itemIndex].imageUrl;
          let text = response[itemIndex].text;
          let value = response[itemIndex].value;
          this.imageReplyForm.patchValue({
            image: imageUrl,
            textInput: text,
            valueInput: value,
          });
        }
        break;
      case 'Image Response':
        {
          this.selectedRC = 'Image Response';
          let imageUrl = response.imageUrl;
          this.irspForm.patchValue({
            image: imageUrl,
          });
        }
        break;
      case 'Ticket Card':
        {
          this.selectedRC = 'Ticket Card';
          this.ticketArray.clear();

          conv.response.items.forEach((item: any, index: number) => {
            // this.addTicket();
            //add form fields

            let items = this.ticketForm.get('items') as FormArray;
            items.push(
              new FormGroup({
                title: new FormControl('', Validators.required),
                action: new FormArray([]),
                data: new FormArray([]),
              })
            );

            //clear array fields
            // let data = this.ticketArray.controls[index].get('data') as FormArray;
            // let attachment = this.ticketArray.controls[index].get('attachment') as FormArray;
            // data.clear();
            // attachment.clear();

            conv.response.items[index].action.forEach((action: any) => {
              this.addTicketAction(index);
            });
            conv.response.items[index].data.forEach((data: any) => {
              this.addTicketData(index);
            });
          });
          this.ticketForm.patchValue(conv.response);
        }
        break;
      case 'Icon Message':
        {
          this.selectedRC = 'Icon Message';
          let url = response[itemIndex].url;
          let message = response[itemIndex].message;
          this.imForm.patchValue({
            icon: url,
            message: message,
          });
        }
        break;
      default:
      // code block
    }

    console.log(this.update);
  };

  removeConversation = (index: number) => {
    this.conversationArray.splice(index, 1);
    this.update = false;
    this.resetAllForms();
    this.selectedRC = '';
  };

  addVoiceResponse = () => {
    if (this.voiceInput.trim() != '') {
      this.addToConversation('Voice', this.voiceInput);
      this.textInput = '';
      this.voiceInput = '';
      this.textResponse = false;
      this.voiceResponse = false;
    }
  };
  updateVoiceResponse = () => {
    if (this.voiceInput.trim() != '') {
      let obj = {
        type: 'Voice',
        response: this.voiceInput,
      };
      this.conversationArray.splice(this.convIndex, 1, obj);
      this.voiceInput = '';
      this.update = false;
      this.textResponse = false;
      this.voiceResponse = false;
    }
  };
  addParagraphResponse = () => {
    if (this.paragraphInput.trim() != '') {
      this.addToConversation('Paragraph', this.paragraphInput);
      this.paragraphInput = '';
    }
  };

  addMessageResponse = () => {
    if (this.messageInput.trim() != '') {
      this.addToConversation('Message', this.messageInput);
      this.messageInput = '';
    }
  };
  addGreetingsResponse = () => {
    if (this.greetingsInput.trim() != '') {
      this.addToConversation('Greetings Card', this.greetingsInput);
      this.greetingsInput = '';
    }
  };

  updateParagraphResponse = () => {
    if (this.paragraphInput.trim() != '') {
      let obj: any = {
        type: 'Paragraph',
        response: {
          id: this.conversationArray[this.convIndex].id,
          text: this.paragraphInput,
        },
      };
      this.conversationArray.splice(this.convIndex, 1, obj);
      this.selectedRC = '';
      this.paragraphInput = '';
      this.update = false;
    }
  };

  updateMessageResponse = () => {
    if (this.messageInput.trim() != '') {
      let obj: any = {
        type: 'Message',
        response: {
          id: this.conversationArray[this.convIndex].id,
          text: this.messageInput,
        },
      };
      this.conversationArray.splice(this.convIndex, 1, obj);
      this.selectedRC = '';
      this.messageInput = '';
      this.update = false;
    }
  };
  updateGreetingsResponse = () => {
    if (this.greetingsInput.trim() != '') {
      let obj: any = {
        type: 'Greetings Card',
        response: {
          id: this.conversationArray[this.convIndex].id,
          text: this.greetingsInput,
        },
      };
      this.conversationArray.splice(this.convIndex, 1, obj);
      this.selectedRC = '';
      this.greetingsInput = '';
      this.update = false;
    }
  };

  updateDownloadCard = () => {
    let message = this.dcForm.get('message').value;
    let title = this.dcForm.get('title').value;
    let file = this.dcForm.get('file').value;

    let obj = {
      message: message,
      title: title,
      url: file
    };
    this.conversationArray[this.convIndex].response = obj;
    this.dcForm.reset();
    this.selectedRC = '';
    this.update = false;
  }

  addPQR = () => {
    let text = this.pqrForm.get('textInput').value;
    let value = this.pqrForm.get('valueInput').value;

    if (text && text.trim() != '' && value && value.trim() != '') {
      let pqr: any = {
        text: text,
        value: value,
      };
      this.pqrList.push(pqr);
      this.pqrForm.reset();
    }
  };

  addOddMsgResp = (oddMsgsArr: [String]): void => {
    this.addToConversation(this.selectedRC, oddMsgsArr);
    this.resetAllForms();
  };

  removeOddMsg = (obj: any) => {
    const i: any = obj.i;
    const j: any = obj.j;
    this.conversationArray[j].response.splice(i, 1);
    if (this.conversationArray[j].response.length == 0) {
      this.conversationArray.splice(j, 1);
    }
    this.resetAllForms();
    this.update = false;
    this.selectedRC = '';
  };

  editOddMsgs = (j: number) => {
    const { response, type } = this.conversationArray[j];
    this.oddMsgsArr = response;
    this.selectedRC = type;
    this.update = true;
    this.convIndex = j;
  };

  updateOddMsgResp = (oddMsgsArr: [String]) => {
    this.conversationArray[this.convIndex].response = oddMsgsArr;
    this.update = false;
    this.selectedRC = '';
    this.oddMsgsArr = [];
  };

  removeOddMsgs(j: number) {
    this.removeConversation(j);
  }

  addTicket = () => {
    let items = this.ticketForm.get('items') as FormArray;
    items.push(this.ticketGroup());
  };

  removeTicket = (i: number) => {
    let items = this.ticketForm.get('items') as FormArray;
    items.removeAt(i);
  };

  removeVideoCarousel = (i: number) => {
    let items = this.videoCarouselForm.get('data') as FormArray;
    items.removeAt(i);
  }

  removeCarousel = (i: number) => {
    let items = this.carouselForm.get('data') as FormArray;
    items.removeAt(i);
  };

  removeCarouselCard = (i: number, j: number, e: any) => {
    if (this.conversationArray[j].response.length === 1) {
      this.conversationArray.splice(j, 1);
    } else {
      this.conversationArray[j].response.splice(i, 1);
    }
    e.stopPropagation();
  };

  addTicketAttachment = (index: number) => {
    let data: any = this.ticketArray.controls[index].get(
      'attachment'
    ) as FormArray;
    data.push(this.attachmentGroup());
  };

  addTicketData = (index: number) => {
    let data: any = this.ticketArray.controls[index].get('data') as FormArray;
    data.push(this.dataGroup());
  };

  removeTicketData = (i: number, j: number) => {
    let data: any = this.ticketArray.controls[i].get('data') as FormArray;
    data.removeAt(j);
  };

  removeRangeItem = (i: number, j: number) => {
    let data: any = this.rangeArray.controls[i].get('data') as FormArray;
    data.removeAt(j);
  }
  addTicketAction = (index: number) => {
    let action: any = this.ticketArray.controls[index].get(
      'action'
    ) as FormArray;
    action.push(this.actionGroup());
  };

  removeTicketAction = (i: number, j: number) => {
    let action: any = this.ticketArray.controls[i].get('action') as FormArray;
    action.removeAt(j);
  };

  updateTicket = () => {
    this.conversationArray[this.convIndex].response = this.ticketForm.value;
    this.clearTicketForm();
    this.update = false;
    this.selectedRC = '';
  };

  addCondition = () => {
    console.log('add condition');
    let textInput: any = this.conditionForm.get('textInput').value;
    let isFreeText: any = this.conditionForm.get('isFreeText').value;
    console.log(textInput);
    if (textInput) {
      let obj = {
        isFreeText: isFreeText,
        text: textInput,
      };
      this.addToConversation('condition', obj);
      this.conditionForm.reset();
    }
    this.update = false;
    this.resetAllForms();
    this.selectedRC = '';
  };
  updateCondition = () => {
    let textInput: any = this.conditionForm.get('textInput').value;
    let isFreeText: any = this.conditionForm.get('isFreeText').value;
    let obj = {
      text: textInput,
      isFreeText: isFreeText,
    };
    this.conversationArray[this.convIndex].response = obj;
    console.log('update condition');
    this.conditionForm.reset();
    this.condUpdate = false;
    this.update = false;
    this.resetAllForms();
    this.selectedRC = '';
  };

  txtVoiceRespChngHandler = (type: any) => {
    this.update = false;
    this.resetAllForms();
    this.selectedRC = '';
    if (type == 'text') {
      this.textResponse = !this.textResponse;
      this.voiceResponse = false;
    } else if (type == 'voice') {
      this.voiceResponse = !this.voiceResponse;
      this.textResponse = false;
    }
  };

  rcChangeHandler = () => {
    this.update = false;
    this.resetAllForms();
    this.conditionForm.reset();
    this.condUpdate = false;
  };

  addPreviousIntent = () => {
    let textInput: any = this.prevIntentForm.get('textInput').value;
    if (textInput) {
      this.addToConversation('prevIntent', textInput);
      this.prevIntentForm.patchValue({ textInput: '' });
    }
  };

  updatePreviousIntent = () => {
    let textInput: any = this.prevIntentForm.get('textInput').value;
    this.conversationArray[this.convIndex].response = textInput;
    this.resetPrevIntentForm();
    this.prevIntentUpdate = false;
  };

  resetPrevIntentForm = () => {
    this.prevIntentForm.patchValue({ textInput: '' });
  };

  clearRespTypeForm = (type: string) => {
    if (type === 't') {
      this.tTypeArray.controls.forEach((ele: any) => {
        //ele.text = null;
        ele.get('text').setValue(null);
        console.log(ele);
      });
    } else if (type === 'v') {
      this.vTypeArray.controls.forEach((ele: any) => {
        //ele.text = null;
        ele.get('text').setValue(null);
        console.log(ele);
      });
    }
  };

  addTResp(): any {
    console.log(this.tRespForm.get('type').value);
    let tRespList = this.tRespForm.get('type').value;
    let valid = true;
    for (let i = 0; i < tRespList.length; i++) {
      if (!tRespList[i].text || tRespList[i].text.trim() === '') {
        valid = false;
        break;
      }
    }
    if (!valid) {
      return false;
    }
    for (let i = 0; i < tRespList.length; i++) {
      this.addToConversation('Text', tRespList[i]);
    }
    this.clearRespTypeForm('t');
    this.textResponse = false;
  }

  addVResp(): any {
    console.log(this.vRespForm.get('type').value);
    let vRespList: any = this.vRespForm.get('type').value;

    let valid = true;
    for (let i = 0; i < vRespList.length; i++) {
      if (!vRespList[i].text || vRespList[i].text.trim() === '') {
        valid = false;
        break;
      }
    }
    if (!valid) {
      return false;
    }

    for (let i = 0; i < vRespList.length; i++) {
      this.addToConversation('Voice', vRespList[i]);
    }
    this.clearRespTypeForm('v');
    this.voiceResponse = false;
  }

  addVideoCarouselResp = () => {
    if (this.videoCarouselForm.status === 'VALID') {
      let videoData: any = []
      this.videoCarouselForm.value.data.forEach((element: any) => {
        const tagList=element.tags.length?element.tags.join(','):''
        videoData.push({
          title: element.title,
          thumbnailUrl: element.thumbnail,
          description: element.description,
          videoUrl: element.videoUrl,
          videosize: element.videoSize?element.videoSize:'$videoSize',
          tags: tagList
        })
      });
      console.log(this.videoCarouselForm.value.data);
      console.log(videoData);
      this.addToConversation(this.selectedRC, videoData);
      this.update = false;
      this.selectedRC = '';
      this.clearVideoCarouselForm();
    }
  }

  updateVideoCarouselResp = () => {
    if (this.videoCarouselForm.status === 'VALID') {
      let videoData: any = []
      this.videoCarouselForm.value.data.forEach((element: any) => {
        const tagList=element.tags.length?element.tags.join(','):''
        videoData.push({
          title: element.title,
          thumbnailUrl: element.thumbnail,
          description: element.description,
          videoUrl: element.videoUrl,
          videosize: element.videoSize?element.videoSize:'$videoSize',
          tags: tagList
        })
      });
      this.conversationArray[this.convIndex].response =
        videoData;
      this.clearVideoCarouselForm();
      this.update = false;
      this.selectedRC = '';
    }
  }

  addCarouselResp = () => {
    if (this.carouselForm.status === 'VALID') {
      this.addToConversation(this.selectedRC, this.carouselForm.value.data);
      this.clearCarouselForm();
      this.update = false;
      this.selectedRC = '';
    }
  };

  updateCarouselResp = () => {
    if (this.carouselForm.status === 'VALID') {
      this.conversationArray[this.convIndex].response =
        this.carouselForm.value.data;
      this.clearCarouselForm();
      this.update = false;
      this.selectedRC = '';
    }
  };

  updateTResp = () => {
    console.log(this.tRespForm.get('type').value);
  };
  updateVResp = () => {
    console.log(this.vRespForm.get('type').value);
  };

  updatePQR = () => {
    let text: any = this.pqrForm.get('textInput').value;
    let value: any = this.pqrForm.get('valueInput').value;
    if (text && text.trim() != '' && value && value.trim() != '') {
      let pqr: any = {
        text: text,
        value: value,
      };
      this.conversationArray[this.convIndex].response[this.itemIndex] = pqr;
      this.pqrForm.reset();
      this.update = false;
      this.selectedRC = '';
    }
  };

  addIQR() {
    let icon = this.iqrForm.get('icon').value;
    let text = this.iqrForm.get('textInput').value;
    let value = this.iqrForm.get('valueInput').value;
    if (
      text &&
      text.trim() != '' &&
      value &&
      value.trim() != '' &&
      icon &&
      icon.trim()
    ) {
      let iqr = {
        text: text,
        iconUrl: icon,
        value: value,
      };
      this.iqrList.push(iqr);
      this.iqrForm.reset();
    }
  }
  updateIQR() {
    let icon = this.iqrForm.get('icon').value;
    let text = this.iqrForm.get('textInput').value;
    let value = this.iqrForm.get('valueInput').value;
    if (
      text &&
      text.trim() != '' &&
      value &&
      value.trim() != '' &&
      icon &&
      icon.trim()
    ) {
      let iqr = {
        text: text,
        iconUrl: icon,
        value: value,
      };
      this.conversationArray[this.convIndex].response[this.itemIndex] = iqr;
      this.iqrForm.reset();
      this.update = false;
      this.selectedRC = '';
    }
  }

  addRQR = () => {
    let text: any = this.rqrForm.get('textInput').value;
    let value: any = this.rqrForm.get('valueInput').value;
    console.log(text);
    console.log(value);
    if (text && text.trim() != '' && value && value.trim() != '') {
      let rqr = {
        text: text,
        value: value,
      };
      this.rqrList.push(rqr);
      this.rqrForm.reset();
    }
  };
  updateRQR = () => {
    let text: any = this.rqrForm.get('textInput').value;
    let value: any = this.rqrForm.get('valueInput').value;
    if (text && text.trim() != '' && value && value.trim() != '') {
      let rqr = {
        text: text,
        value: value,
      };
      this.conversationArray[this.convIndex].response[this.itemIndex] = rqr;
      this.rqrForm.reset();
      this.update = false;
      this.selectedRC = '';
    }
  };
  addIM = () => {
    let icon: any = this.imForm.get('icon').value;
    let message: any = this.imForm.get('message').value;
    if (icon && icon.trim() && message && message.trim() != '') {
      let im = {
        url: icon,
        message: message,
      };
      this.imList.push(im);
      this.imForm.reset();
    }
  };
  updateIM = () => {
    let iconUrl: any = this.imForm.get('icon').value;
    let message: any = this.imForm.get('message').value;
    let im = {
      url: iconUrl,
      message: message,
    };
    this.conversationArray[this.convIndex].response[this.itemIndex] = im;
    this.imForm.reset();
    this.selectedRC = '';
    this.update = false;
  };

  addVR = () => {
    let image: any = this.vrForm.get('image').value;
    let imagePosition: any = this.vrForm.get('imagePosition').value;
    let text: any = this.vrForm.get('text').value;
    if (
      image &&
      image.trim() != '' &&
      imagePosition &&
      imagePosition.trim() != '' &&
      text &&
      text.trim() != ''
    ) {
      let vr = {
        imageUrl: image,
        imagePosition: imagePosition,
        text: text,
      };
      this.vrList.push(vr);
      this.vrForm.reset();
    }
  };

  removePQR = (i: number, j: number) => {
    this.pqrList.splice(i, 1);
    if (j != null) {
      this.conversationArray[j].response.splice(i, 1);
      if (this.conversationArray[j].response.length == 0) {
        this.conversationArray.splice(j, 1);
      }
    }
    this.resetAllForms();
    this.update = false;
    this.selectedRC = '';
  };

  removeRQR = (i: number, j: number) => {
    this.rqrList.splice(i, 1);
    if (j != null) {
      this.conversationArray[j].response.splice(i, 1);
      if (this.conversationArray[j].response.length == 0) {
        this.conversationArray.splice(j, 1);
      }
    }
    this.resetAllForms();
    this.update = false;
    this.selectedRC = '';
  };

  removeIM = (i: number, j: number) => {
    this.imList.splice(i, 1);
    if (j != null) {
      this.conversationArray[j].response.splice(i, 1);
      if (this.conversationArray[j].response.length == 0) {
        this.conversationArray.splice(j, 1);
      }
    }
    this.resetAllForms();
    this.update = false;
    this.selectedRC = '';
  };

  removeConvTicket = (i: number, j: number) => {
    if (j != null) {
      this.conversationArray[j].response.items.splice(i, 1);
      if (this.conversationArray[j].response.items.length == 0) {
        this.conversationArray.splice(j, 1);
      }
    }
    this.resetAllForms();
    this.update = false;
    this.selectedRC = '';
  };

  removeIQR = (i: number, j: number) => {
    this.iqrList.splice(i, 1);
    if (j != null) {
      this.conversationArray[j].response.splice(i, 1);
      if (this.conversationArray[j].response.length == 0) {
        this.conversationArray.splice(j, 1);
      }
    }
    this.resetAllForms();
    this.update = false;
    this.selectedRC = '';
  };

  removeIRsp = (i: number, j: number) => {
    if (j != null) {
      this.conversationArray.splice(j, 1);
    }
    this.resetAllForms();
    this.update = false;
    this.selectedRC = '';
  };

  removeImageReply = (i: number, j: number) => {
    this.imageReplyList.splice(i, 1);
    if (j != null) {
      this.conversationArray[j].response.splice(i, 1);
      if (this.conversationArray[j].response.length == 0) {
        this.conversationArray.splice(j, 1);
      }
    }
    this.resetAllForms();
    this.update = false;
    this.selectedRC = '';
  };

  removeVR = (i: number, j: number) => {
    this.vrList.splice(i, 1);
    if (j != null) {
      this.conversationArray.splice(j, 1);
    }
    this.resetAllForms();
    this.update = false;
    this.selectedRC = '';
  };

  removeResponse = (i: number, j: number) => {
    this.responsesArray.splice(i, 1);
    this.resetAllForms();
    this.update = false;
    this.selectedRC = '';
  };

  removeDesc = (i: number, j: number) => {
    let description = this.carouselArray.controls[i].get(
      'description'
    ) as FormArray;
    description.removeAt(j);
  };

  fetchRichCardsList = () => {
    this.isResponseLibraryService.richCardFetch(this.serviceId).subscribe(
      (data) => {
        this.rcList = data.data;
        // this.rcList.push('Download Card');
        // this.rcList.push('Video Carousal');
        this.rcList.push('Carousel');
        this.rcList.push('Login Card');
        this.rcList.push('Property View Card');
        this.rcList.push('List View Card');
        this.rcList.push('Greetings Card');
        this.rcList = this.rcList.sort();
      },
      (error) => {
        console.log(error);
      }
    );
  };



  uploadResponseList = async () => {
    // console.log(this.responsesArray);
    console.log(this.conversationArray);
    // let botStatus = await this.checkBotStatus(null);
    // if (!botStatus) {
    //   return false;
    // }
    this.ngxService.start();
    let payload: any = this.formatPreview();
    if (!payload.hasOwnProperty("conditionedResponses")) {
      payload["conditionedResponses"] = [];
    }
    const botType = localStorage.getItem("botType")
    payload.id = this.intentId;
    console.log(payload);
    this.isResponseLibraryService.updateResponse(botType, payload).subscribe((data) => {
      this.toastr.success(data.message);
      this.fetchResponse();
      this.ngxService.stop()
    }, (error) => {
      this.toastr.error(error.error.message);
      console.log(error);
    });
    console.log("update response");
  };

  fetchIntent = (intentName: string) => {
    let payload = {
      intentName: intentName,
    };
    this.slotsLoaded = false;
    this.isIntentsService
      .fetchIntentData(this.botType, this.serviceId, payload)
      .subscribe(
        (data) => {
          this.intent = data.data[0];
          // this.slots = this.intent.addedSlots;
          // if (this.slots.length == 0) {
          //   this.fetchResponse();
          // }

          //  this.slotsLoaded = true;
          console.log(this.intent);
        },
        (error) => {
          console.log(error);
          // this.slotsLoaded = true;
        }
      );
  };

  fetchIntents = () => {
    this.isIntentsService
      .getIntentList(2, '', this.botType, this.serviceId)
      .subscribe(
        (data) => {
          this.intentsArray = data.data;
          console.log(this.intentsArray);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  fetchSlots = () => {
    let payload = {
      intentName: this.intentName,
      intentTypeId: this.intentTypeId,
    };
    this.slotsLoaded = false;
    this.isResponseLibraryService.getslots(this.botType, payload).subscribe(
      (data) => {
        console.log(data);
        this.userDefinedSlots = data.data[0].userDefinedSlots;
        this.systemDefinedSlots = data.data[1].systemDefinedSlots;
        this.slotsLoaded = true;
      },
      (error) => {
        console.log(error);
        this.slotsLoaded = true;
      }
    );
  };

  fetchResponseType = () => {
    let payload = {
      slotName: this.selectedSlot,
    };

    this.isResponseLibraryService
      .fetchOneResponse(this.botType, payload)
      .subscribe(
        (data) => {
          this.responseTypeArray = data.data;
          console.log(this.responseTypeArray)
          if (this.responseTypeArray.length > 0) {
            this.tTypeArray.controls = [];
            this.vTypeArray.controls = [];
            for (let i = 0; i < this.responseTypeArray.length; i++) {
              const responseType = this.responseTypeArray[i];
              this.tTypeArray.push(this.rTypeGroup(responseType));
              this.vTypeArray.push(this.rTypeGroup(responseType));
            }
            console.log(this.responseTypeArray);
            console.log(this.tRespForm);
            console.log(this.vRespForm);
          }
        },
        (error) => {
          console.log(error);
          this.slotsLoaded = true;
        }
      );
  };

  toggleSlot = (slot: string, type: string) => {
    if (this.selectedSlot === slot) {
      this.selectedSlot = null;
      this.selectedSlotType = null;
    } else {
      this.selectedSlot = slot;
      this.selectedSlotType = type;
    }

    this.fetchResponse();
    this.fetchResponseType();
  };

  fetchResponse = () => {
    this.conversationArray = [];
    let payload: any = {
      intentName: this.intentName,
      isSlotPresent: false,
      slotsAdded: [],
      isFreeText: false,
      globalIntent: false,
    };
    if (this.selectedSlot) {
      payload['intentName'] = this.intentName;
      payload['isSlotPresent'] = true;
      payload['slotsAdded'] = [
        {
          slotType: this.selectedSlotType,
          slotValue: this.selectedSlot,
        },
      ];
    }

    this.isResponseLibraryService
      .fetchOneResponse(this.botType, payload)
      .subscribe(
        (data) => {
          this.showUpdateButton = true; //Show update button
          this.resetAllForms();
          this.selectedRC = ''; //Hide any visible forms
          data = data.data;

          let response = data[data.length - 1];
          if (response.conditionedResponses.length > 0) {
            this.conditionResponse = true; //check add condition switch
          } else if (response.intentBasedResponses.length > 0) {
            this.globalResponse = true; //check add global response switch
            this.conditionResponse = true; // check add condition switch
          } else if (response.richCardDetails.length > 0) {
            this.globalResponse = false; //uncheck add global response switch
            this.conditionResponse = false; //uncheck add condition switch
          }

          console.log(response);

          this.responseId = response._id;
          //save intent id. This will be used in update API call
          this.intentId = response._id;
          console.log('response ', response);
          response.textResponse.forEach((response: any) => {
            //get text response
            let text = {
              type: 'Text',
              response: response,
            };
            this.conversationArray.push(text);
          });

          response.voiceResponse.forEach((response: any) => {
            //get voice response
            let voice = {
              type: 'Voice',
              response: response,
            };
            this.conversationArray.push(voice);
          });

          //handle null case
          if (response.isFreeText) {
            this.isFreeText = true;
          } else {
            this.isFreeText = false;
          }

          if (response.globalIntent) {
            //Global intent------------------------
            this.globalResponse = true;
            for (let i = 0; i < response.intentBasedResponses.length; i++) {
              const { prevIntent, conditionedResponses } =
                response.intentBasedResponses[i];
              let obj: any = {
                type: 'prevIntent',
                response: prevIntent,
              };
              this.conversationArray.push(obj);

              for (let i = 0; i < conditionedResponses.length; i++) {
                const { conditionType, conditionValue } =
                  conditionedResponses[i];

                let obj1 = {
                  text: conditionType,
                  isFreeText: false,
                };
                if (this.isFreeText) {
                  if (response.freeTextCondition.indexOf(conditionType) > -1) {
                    obj1.isFreeText = true;
                  }
                }

                let obj: any = {
                  type: 'condition',
                  response: obj1,
                };

                this.conversationArray.push(obj);

                for (let j = 0; j < conditionValue.length; j++) {
                  const type = conditionValue[j].type;
                  let value: any;
                  if (conditionValue[j].value) {
                    value = conditionValue[j].value.data;
                  }

                  let obj: any = {};

                  if (type === 'Slider') {
                    let res = conditionValue[j].value;
                    console.log(conditionValue[j]);
                    let options = {
                      floor: res.sliderMinRange,
                      ceil: res.sliderMaxRange,
                    };
                    obj.options = options;
                    obj.title = res.sliderTitle;
                    obj.response = res;
                    obj.type = type;
                    this.options = {
                      floor: res.sliderMinRange,
                      ceil: res.sliderMaxRange,
                    };
                  } else if (type === 'Login Card') {
                    obj = {
                      type: type,
                      response: conditionValue[j].value,
                    };
                  } else if (type === 'Message' || type == "Greetings Card") {
                    obj = {
                      type: type,
                      response: {
                        text: conditionValue[j].value,
                      },
                    };
                  } else if (type === 'Paragraph') {
                    obj = {
                      type: type,
                      response: value[0],
                    };
                  } else if (type === 'Odd Messages') {
                    obj = {
                      type: type,
                      response: conditionValue[j].value,
                    };
                  } else if (type === 'List View') {
                    const _value = conditionValue[j].value;
                    const lv = {
                      title: _value.title,
                      url: _value.url,
                      values: _value.data[0].values,
                    };
                    obj = {
                      type: type,
                      response: lv,
                    };
                  } else {
                    obj = {
                      type: type,
                      response: value,
                    };
                  }

                  this.conversationArray.push(obj);
                }
              }
            }
          } else {
            this.globalResponse = false;
            //get all rich cards

            if (response.conditionedResponses.length > 0) {
              //Conditional response-------------------------
              for (let i = 0; i < response.conditionedResponses.length; i++) {
                const { conditionType, conditionValue } =
                  response.conditionedResponses[i];

                let obj1 = {
                  text: conditionType,
                  isFreeText: false,
                };

                if (
                  response.freeTextCondition &&
                  response.freeTextCondition.indexOf(conditionType) > -1
                ) {
                  obj1.isFreeText = true;
                }

                let obj: any = {
                  type: 'condition',
                  response: obj1,
                };

                this.conversationArray.push(obj);

                for (let j = 0; j < conditionValue.length; j++) {
                  const type = conditionValue[j].type;
                  let value: any;
                  if (conditionValue[j].value) {
                    value = conditionValue[j].value.data;
                  }

                  let obj: any = {};

                  if (type === 'Slider') {
                    let res = conditionValue[j].value;
                    console.log(conditionValue[j]);
                    let options = {
                      floor: res.sliderMinRange,
                      ceil: res.sliderMaxRange,
                    };
                    obj.options = options;
                    obj.title = res.sliderTitle;
                    obj.response = res;
                    obj.type = type;
                    this.options = {
                      floor: res.sliderMinRange,
                      ceil: res.sliderMaxRange,
                    };
                  } else if (type === 'Message' || type == "Greetings Card") {
                    obj = {
                      type: type,
                      response: {
                        text: conditionValue[j].value,
                      },
                    };
                  } else if (type === 'Login Card') {
                    obj = {
                      type: type,
                      response: conditionValue[j].value,
                    };
                  } else if (type === 'Odd Messages') {
                    obj = {
                      type: type,
                      response: conditionValue[j].value,
                    };
                  } else if (type === 'Paragraph') {
                    obj = {
                      type: type,
                      response: value[0],
                    };
                  } else if (type === 'List View') {
                    const _value = conditionValue[j].value;
                    const lv = {
                      title: _value.title,
                      url: _value.url,
                      values: _value.data[0].values,
                    };
                    obj = {
                      type: type,
                      response: lv,
                    };
                  } else {
                    obj = {
                      type: type,
                      response: value,
                    };
                  }

                  this.conversationArray.push(obj);
                }
              }
            } else if (response.richCardDetails.length > 0) {
              //conditionless response
              for (let i = 0; i < response.richCardDetails.length; i++) {
                const { type } = response.richCardDetails[i];

                let value: any;
                if (response.richCardDetails[i].value) {
                  value = response.richCardDetails[i].value.data;
                }

                let obj: any = {};

                if (type === 'Slider') {
                  console.log(response.richCardDetails[i]);
                  console.log(value);
                  let res = response.richCardDetails[i].value;
                  let options = {
                    floor: res.sliderMinRange,
                    ceil: res.sliderMaxRange,
                  };
                  obj.options = options;
                  obj.title = res.sliderTitle;
                  obj.response = res;
                  obj.type = type;
                  this.options = {
                    floor: res.sliderMinRange,
                    ceil: res.sliderMaxRange,
                  };
                } else if (type === 'Feedback Card') {
                  console.log(type);
                  console.log(response.richCardDetails[i].value.data);
                  obj = {
                    type: type,
                    response: response.richCardDetails[i].value.data,
                  };
                  let starsArray = response.richCardDetails[i].value.data.data;
                  this.selectedStarValue = starsArray[0].value;
                } else if (type === 'Message' || type == "Greetings Card") {
                  obj = {
                    type: type,
                    response: {
                      text: response.richCardDetails[i].value,
                    },
                  };
                } else if (type === 'Odd Messages') {
                  obj = {
                    type: type,
                    response: response.richCardDetails[i].value,
                  };
                } else if (type === 'Paragraph') {
                  obj = {
                    type: type,
                    response: value[0],
                  };
                } else if (type === 'Plain Quick Reply') {
                  obj = {
                    type: type,
                    response: value,
                  };
                } else if (type === 'Rounded Quick Reply') {
                  obj = {
                    type: type,
                    response: value,
                  };
                } else if (type === 'Image Reply') {
                  obj = {
                    type: type,
                    response: value,
                  };
                } else if (type === 'Login Card') {
                  obj = {
                    type: type,
                    response: response.richCardDetails[i].value,
                  };
                } else if (type === 'Icon Message') {
                  obj = {
                    type: type,
                    response: value,
                  };
                } else if (type === 'Image Response') {
                  obj = {
                    type: type,
                    response: value,
                  };
                } else if (type === 'Icon Quick Reply') {
                  obj = {
                    type: type,
                    response: value,
                  };
                } else if (type === 'Visual Reply') {
                  obj = {
                    type: type,
                    response: value,
                  };
                } else if (type === 'List View') {
                  const lv = {
                    title: value.title,
                    url: value.url,
                    values: value.data[0].values,
                  };
                  obj = {
                    type: type,
                    response: lv,
                  };
                } else if (type === 'Plain Quick Reply') {
                  obj = {
                    type: type,
                    response: value,
                  };
                } else {
                  obj = {
                    type: type,
                    response: value,
                  };
                }
                this.conversationArray.push(obj);
              }
            }
          }

          console.log(this.conversationArray);
        },
        (error) => {
          this.toastr.info(error.error.message);
          this.showUpdateButton = false; // hide update button
        }
      );
  };

  grChangeHandler = () => {
    //If global response is added then conditions must be added
    if (this.globalResponse) {
      this.conditionResponse = true;
      this.getIntentList();
    }
  };

  getIntentList() {
    this.ngxService.start();
    this.isIntentsService
      .getIntentList(this.intentTypeId, '', this.botType, this.serviceId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.intentsArray = data['data'];
            this.ngxService.stop();
          } else {
            this.toastr.error(data['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }
}
