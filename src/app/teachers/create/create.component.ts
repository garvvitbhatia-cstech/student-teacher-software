import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  carriers:any;
  classes:any;
  subjects:any;
  boards:any;
  form: FormGroup;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      phone: ['', Validators.required],
      qualification: ['', Validators.required],
      board: ['', Validators.required],
      subject: ['', Validators.required],
      class: ['', Validators.required],
      fees: ['', Validators.required],
      teaching_exp: ['', Validators.required],
      zipcode: ['', Validators.required],
      pan_no: ['', Validators.required],
      aadhar_no: ['', Validators.required],
      about_us: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkPermission();
    this.getClasses();
    this.getSubjects();
    this.getBoards();

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
  getBoards(){
    this.appService.getData('get/boards/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.boards = r.users;
      }else{
        this.toastr.error("Board not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
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
        this.toastr.error("Carrier not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  createUser(form: any){
    $('#submitBtn').html('Processing');
    var file_data = $('#profile_image').prop('files')[0];
    var formData  = new FormData();
    var subjects = form.subject;
    var classes = form.class;

    var board = form.board;
    formData.append('token',localStorage.getItem('token') as string);
    formData.append('name',$('#name').val() as string);
    formData.append('email',$('#email').val() as string);
    formData.append('password',$('#password').val() as string);
    formData.append('confirm_password',$('#confirm_password').val() as string);
    formData.append('phone',$('#phone').val() as string);
    formData.append('zipcode',$('#zipcode').val() as string);
    formData.append('access','*');
    formData.append('qualification',$('#qualification').val() as string);
    formData.append('board',board);
    formData.append('subject', subjects);
    formData.append('class', classes);
    formData.append('fees',$('#fees').val() as string);
    formData.append('teaching_exp',$('#teaching_exp').val() as string);
    formData.append('pan_no',$('#pan_no').val() as string);
    formData.append('aadhar_no',$('#aadhar_no').val() as string);
    formData.append('about_us',$('#about_us').val() as string);
    formData.append('file',file_data);
    formData.append('address',$('#address').val() as string);
    this.appService.postData('super/admin/create',formData).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('teachers');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }

}
