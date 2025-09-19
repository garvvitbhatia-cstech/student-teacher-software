import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.css']
})
export class QuestionCreateComponent implements OnInit,OnDestroy {

  form: FormGroup;
  destroy$ = new Subject();
  classes:any;
  subjects:any;
  answerOptions:any;
  questionType:any;
  multipleOption:any;
  answerOptionsArr:any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      class_id: ['', Validators.required],
      subject_id: ['', Validators.required],
      type: ['', Validators.required],
      question: ['', Validators.required],
      option:['', Validators.required],
      answer:['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.checkPermission();
    this.getClasses();
    this.getSubjects();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  checkPermission(){
    this.appService.getData('check/permission/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){}else{
        this.router.navigateByUrl('/dashboard');
      }
    });
  }
  getClasses(){
    this.appService.getData('get/classes/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.classes = r.users;
      }else{
        this.toastr.error("Carrier not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getSubjects(){
    this.appService.getData('get/subjects/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.subjects = r.users;
      }else{
        this.toastr.error("Subjects not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  createQuestion(form: any){
    $('#submitBtn').html('Processing');

    this.answerOptionsArr = [];
    if(typeof this.answerOptions !="undefined" ){
      if(this.answerOptions.length > 0){
        for (let i = 0; i <= this.answerOptions.length; i++) {
          var option = $('#option_'+i).val();
          if(option != "" && option != null){
            this.answerOptionsArr.push($('#option_'+i).val());
          }
        }
      }
    }

    const data = {
      token: localStorage.getItem('token'),
      class_id:form.class_id,
      subject_id:form.subject_id,
      type: form.type,
      question: form.question,
      option: this.answerOptionsArr,
      answer: form.answer,
    };
    this.appService.postData('question/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('questionnaires');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
  showAnswers(){
    var selectedType = $('#type').val();
    this.answerOptions = [];
    this.questionType = selectedType;
    if(selectedType == "TrueAndFalse"){
      this.answerOptions.push({title : 'Answer 1', value : 'Yes'});
      this.answerOptions.push({title : 'Answer 2', value : 'No' });
    }
    if(selectedType == "MultipleChoiceRadio" || selectedType == "MultipleChoiceCheckbox" || selectedType == "SelectBox"){
      this.multipleOption = 1;
      this.answerOptions.push({title : 'Answer', value : ''});
    }
  }
  addMoreOption(){
    this.multipleOption = this.multipleOption+1;
    this.answerOptions.push({title : 'Answer', value : '' , name : 'option[]'});
  }
  removeMoreOption(index: any){
    this.answerOptions.splice(index, 1);
  }
}
