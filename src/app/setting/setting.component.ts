import { Component, OnInit,OnDestroy } from '@angular/core';
import { AppService } from '../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit,OnDestroy {

  setting:any;
  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    ) {
      this.form = this.fb.group({
        teacher_commission: ['', Validators.required],
        collection_history_days: ['', Validators.required],
        payment_collect_days: ['', Validators.required],
        student_app_version: ['', Validators.required],
        teacher_app_version: ['', Validators.required]
      });
     }

  ngOnInit(): void {
    this.getSettings();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getSettings(){
    this.appService.getData('settings/get').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['teacher_commission'].setValue(r.data.teacher_commission);
        this.form.controls['collection_history_days'].setValue(r.data.collection_history_days);
        this.form.controls['payment_collect_days'].setValue(r.data.payment_collect_days);
        this.form.controls['student_app_version'].setValue(r.data.student_app_version);
        this.form.controls['teacher_app_version'].setValue(r.data.teacher_app_version);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    });
  }
  updateSetting(form: any){
    $('#updateBtn').html('Processing');
    const data = {
      token:localStorage.getItem('token'),
      teacher_commission: form.teacher_commission,
      collection_history_days: form.collection_history_days,
      payment_collect_days: form.payment_collect_days,
      student_app_version: form.student_app_version,
      teacher_app_version: form.teacher_app_version
    };
    this.appService.postData('settings/update',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#updateBtn').html('Update');
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }

}
