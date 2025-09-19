
import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-content-create',
  templateUrl: './content-create.component.html',
  styleUrls: ['./content-create.component.css']
})
export class ContentCreateComponent implements OnInit {
  form: FormGroup;
  destroy$ = new Subject();
  classes:any;
  subjects:any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      class_id: ['', Validators.required],
      subject_id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
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
  createContent(form: any){
    $('#submitBtn').html('Processing');
    var file_data = $('#document').prop('files')[0];
    var formData  = new FormData();
    formData.append('token',localStorage.getItem('token') as string);
    formData.append('class_id',form.class_id);
    formData.append('subject_id',form.subject_id);
    formData.append('title',form.title);
    formData.append('description',form.description);
    formData.append('file',file_data);
    this.appService.postData('content/create',formData).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('contents');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }

}

