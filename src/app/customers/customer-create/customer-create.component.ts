import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  countries:any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    public fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.checkPermission();
    this.getCountries();

  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getCountries(){
    this.appService.getData('countries/get').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.countries = r.data;
    });
  }
  checkPermission(){
    this.appService.getData('check/permission/7').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){}else{
        this.router.navigateByUrl('/dashboard');
      }
    });
  }
  createUser(){
    $('#submitBtn').html('Processing');
    var file_data = $('#profile_image').prop('files')[0];
    var form  = new FormData();
    form.append('token',localStorage.getItem('token') as string);
    form.append('name',$('#name').val() as string);
    form.append('email',$('#email').val() as string);
    form.append('password',$('#password').val() as string);
    form.append('confirm_password',$('#confirm_password').val() as string);
    form.append('phone',$('#phone').val() as string);
    form.append('address',$('#address').val() as string);
    form.append('zipcode',$('#zipcode').val() as string);
    form.append('file',file_data);
    this.appService.postData('customer/create',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('students');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }

}
