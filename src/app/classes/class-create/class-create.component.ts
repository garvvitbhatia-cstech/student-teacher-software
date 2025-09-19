import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-class-create',
  templateUrl: './class-create.component.html',
  styleUrls: ['./class-create.component.css']
})
export class ClassCreateComponent implements OnInit,OnDestroy {

  form: FormGroup;
  destroy$ = new Subject();
  carriers:any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
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
  createClass(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      title: form.title,
    };
    this.appService.postData('class/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('classes');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
}
