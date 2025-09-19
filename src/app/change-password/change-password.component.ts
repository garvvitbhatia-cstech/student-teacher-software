import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit,OnDestroy {

  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder
    ) {
      this.form = this.fb.group({
        current_password: ['', Validators.required],
        password: ['', Validators.required],
        confirm_password: ['', Validators.required]
      });
     }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }

  updatePassword(form: any){
    $('#updateBtn').html('Processing');
    const data = {
      token:localStorage.getItem('token'),
      current_password: form.current_password,
      password: form.password,
      confirm_password: form.confirm_password
    };
    this.appService.postData('password/update',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
