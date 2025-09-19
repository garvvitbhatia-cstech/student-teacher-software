import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-slider-create',
  templateUrl: './slider-create.component.html',
  styleUrls: ['./slider-create.component.css']
})
export class SliderCreateComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    public fb: FormBuilder,
  ) {

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
  createSlider(){
    $('#submitBtn').html('Processing');
    var file_data = $('#document').prop('files')[0];
    var form  = new FormData();
    form.append('token',localStorage.getItem('token') as string);
    form.append('title',$('#title').val() as string);
    form.append('description',$('#description').val() as string);
    form.append('file',file_data);

    this.appService.postData('slider/create',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('sliders');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
}
