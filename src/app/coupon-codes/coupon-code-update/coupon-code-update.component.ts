import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-coupon-code-update',
  templateUrl: './coupon-code-update.component.html',
  styleUrls: ['./coupon-code-update.component.css']
})
export class CouponCodeUpdateComponent implements OnInit {

  rowID:any;
  user:any;
  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      coupon_code: ['', Validators.required],
      percent_off: ['', Validators.required],

    });
  }
  ngOnInit(): void {
    this.rowID = this.route.snapshot.params['idRow'];
    this.getUserInfo(this.rowID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getUserInfo(id:number){
    this.appService.getData('coupon-code/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['coupon_code'].setValue(r.data.coupon_code);
        this.form.controls['percent_off'].setValue(r.data.percent_off);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateRecord(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      coupon_code: form.coupon_code,
      percent_off: form.percent_off,
    };
    this.appService.putData('coupon-code/update/'+this.rowID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Update');
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
}
