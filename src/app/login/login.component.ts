import { Component, OnInit,OnDestroy } from '@angular/core';
import { AppService } from '../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder,
    ) {
      this.form = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
     }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  LoginNow(form: any){
    const data = {
      email: form.email,
      password: form.password
    };
    $('#loginBtn').html('Processing');
    this.appService.login('login',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#loginBtn').html('Login');
      if(r.success){
        localStorage.setItem('token', r.token);
        localStorage.setItem('login_user_type', r.user_type);
        localStorage.setItem('login_user_name', r.user_name);
        localStorage.setItem('login_user_email', r.user_email);
        localStorage.setItem('login_user_phone', r.user_phone);
        localStorage.setItem('login_user_role', r.user_role);
        localStorage.setItem('login_user_permissions', r.user_permissions);
        this.router.navigateByUrl('dashboard');
      }else{
        this.toastr.error(r.message,"Error");
      }
    },error =>{
      this.toastr.error('Internal error occur',"Error");
    });
  }

}
