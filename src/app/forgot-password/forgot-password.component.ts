import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit,OnDestroy {
  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder,
    ) {
      this.form = this.fb.group({
        email: ['', Validators.required]
      });
     }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  sendEmail(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      email: form.email
    };
    this.appService.login('forgot/password',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }

}
