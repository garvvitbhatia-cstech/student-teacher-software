import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-testimonial-update',
  templateUrl: './testimonial-update.component.html',
  styleUrls: ['./testimonial-update.component.css']
})
export class TestimonialUpdateComponent implements OnInit,OnDestroy {

  testimonialID:any;
  user:any;
  destroy$ = new Subject();
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      star_rating: 1,
    });
  }
  ngOnInit(): void {
    this.testimonialID = this.route.snapshot.params['idTestimonial'];
    this.getUserInfo(this.testimonialID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getUserInfo(id:number){
    this.appService.getData('testimonial/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['name'].setValue(r.data.name);
        this.form.controls['description'].setValue(r.data.description);
        this.form.controls['star_rating'].setValue(r.data.star_rating);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateTestimonial(){
    $('#submitBtn').html('Processing');
    var file_data = $('#document').prop('files')[0];
    var submitForm  = new FormData();
    submitForm.append('token',localStorage.getItem('token') as string);
    submitForm.append('name',$('#name').val() as string);
    submitForm.append('star_rating',$('#star_rating').val() as string);
    submitForm.append('description',$('#description').val() as string);
    submitForm.append('file',file_data);
    this.appService.postData('testimonial/update/'+this.testimonialID,submitForm).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
