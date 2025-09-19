import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-teacher-package-update',
  templateUrl: './teacher-package-update.component.html',
  styleUrls: ['./teacher-package-update.component.css']
})
export class TeacherPackageUpdateComponent implements OnInit,OnDestroy {

  packageID:any;
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
      title: ['', Validators.required],
      duration: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.packageID = this.route.snapshot.params['idPackage'];
    this.getUserInfo(this.packageID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getUserInfo(id:number){
    this.appService.getData('teacher-package/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['title'].setValue(r.data.title);
        this.form.controls['duration'].setValue(r.data.duration);
        this.form.controls['description'].setValue(r.data.description);
        this.form.controls['price'].setValue(r.data.price);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updatePackage(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      title: form.title,
      duration: form.duration,
      description: form.description,
      price: form.price
    };
    this.appService.putData('teacher-package/update/'+this.packageID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
