import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-slider-update',
  templateUrl: './slider-update.component.html',
  styleUrls: ['./slider-update.component.css']
})
export class SliderUpdateComponent implements OnInit,OnDestroy {

  sliderID:any;
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
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.sliderID = this.route.snapshot.params['idSlider'];
    this.getUserInfo(this.sliderID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getUserInfo(id:number){
    this.appService.getData('slider/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['title'].setValue(r.data.title);
        this.form.controls['description'].setValue(r.data.description);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateSlider(){
    $('#submitBtn').html('Processing');
    var file_data = $('#document').prop('files')[0];
    var submitForm  = new FormData();
    submitForm.append('token',localStorage.getItem('token') as string);
    submitForm.append('title',$('#title').val() as string);
    submitForm.append('description',$('#description').val() as string);
    submitForm.append('file',file_data);
    this.appService.postData('slider/update/'+this.sliderID,submitForm).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
