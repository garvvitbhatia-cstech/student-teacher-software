import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.css']
})
export class AccountCreateComponent implements OnInit {

  form: FormGroup;
  destroy$ = new Subject();
  countries:any;
  cities:any;

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
      address: ['', Validators.required],
      zipcode: ['', Validators.required],
      allow_for_city: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkPermission();
    this.getCountries();
    this.getCities();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getCities(){
    const data = {
      token: localStorage.getItem('token')
    };
    this.appService.postData('franchise/list/all',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.cities = r.users;
    });
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
  createUser(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      name: form.name,
      email: form.email,
      password: form.password,
      confirm_password: form.confirm_password,
      phone: form.phone,
      role: form.role,
      allow_for_city:form.allow_for_city
    };
    this.appService.postData('account/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('accounts');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }

}