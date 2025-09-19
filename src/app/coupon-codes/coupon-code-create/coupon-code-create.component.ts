import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-coupon-code-create',
  templateUrl: './coupon-code-create.component.html',
  styleUrls: ['./coupon-code-create.component.css']
})
export class CouponCodeCreateComponent implements OnInit {

  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      coupon_code: ['', Validators.required],
      percent_off: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkPermission();

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
  createRecord(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      coupon_code: form.coupon_code,
      percent_off: form.percent_off,
    };
    this.appService.postData('coupon-code/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('coupon-codes');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
}
