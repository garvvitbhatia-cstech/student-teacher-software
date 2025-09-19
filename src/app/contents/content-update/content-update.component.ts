

import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-content-update',
  templateUrl: './content-update.component.html',
  styleUrls: ['./content-update.component.css']
})
export class ContentUpdateComponent implements OnInit {

  SiteUrl = environment.serviceUrl;

  form: FormGroup;
  destroy$ = new Subject();
  classes:any;
  subjects:any;
  RowID:any;

  constructor(
    private route: ActivatedRoute,
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
    this.RowID = this.route.snapshot.params['idRow'];
    this.getQuestionInfo(this.RowID);
    this.getClasses();
    this.getSubjects();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getQuestionInfo(id:number){
    this.appService.getData('content/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        if(r.data != null){
        this.form.controls['class_id'].setValue(r.data.class_id);
        this.form.controls['subject_id'].setValue(r.data.subject_id);
        this.form.controls['title'].setValue(r.data.title);
        this.form.controls['description'].setValue(r.data.description);
        if(r.data.content_file !=""){
          $('#existFile').show();
          $('#existFile .abtn').html('<a href="'+this.SiteUrl+'storage/contents/'+r.data.content_file+'" class="btn btn-sm btn-primary" target="_blank">View File</a>');
        }
      }
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
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
    this.appService.getData('get/classes/list/edit/'+this.RowID).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
    this.appService.getData('get/subjects/list/edit/'+this.RowID).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
  createUpdate(form: any){
    $('#submitBtn').html('Processing');

    var file_data = $('#document').prop('files')[0];
    var formData  = new FormData();
    formData.append('token',localStorage.getItem('token') as string);
    formData.append('class_id',form.class_id);
    formData.append('subject_id',form.subject_id);
    formData.append('title',form.title);
    formData.append('description',form.description);
    formData.append('file',file_data);
    this.appService.putData('content/update/'+this.RowID,formData).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
}
