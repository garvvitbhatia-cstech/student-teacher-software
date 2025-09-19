import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-testimonial-create',
  templateUrl: './testimonial-create.component.html',
  styleUrls: ['./testimonial-create.component.css']
})
export class TestimonialCreateComponent implements OnInit,OnDestroy {

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
    $('#star_rating').val(1);
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
  createTestimonial(){
    $('#submitBtn').html('Processing');
    var file_data = $('#document').prop('files')[0];
    var form  = new FormData();
    form.append('token',localStorage.getItem('token') as string);
    form.append('name',$('#name').val() as string);
    form.append('description',$('#description').val() as string);
    form.append('star_rating',$('#star_rating').val() as string);
    form.append('file',file_data);

    this.appService.postData('testimonial/create',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('testimonials');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
}
