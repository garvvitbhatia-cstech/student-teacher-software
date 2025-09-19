import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-teacher-address-update',
  templateUrl: './teacher-address-update.component.html',
  styleUrls: ['./teacher-address-update.component.css']
})
export class TeacherAddressUpdateComponent implements OnInit {

  addressID:any;
  teacherID:any;
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
      teacher_address: ['', Validators.required],

    });
  }
  ngOnInit(): void {
    this.teacherID = this.route.snapshot.params['idTeacher'];
    this.addressID = this.route.snapshot.params['idAddress'];
    this.getUserInfo(this.addressID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getUserInfo(id:number){
    this.appService.getData('teacher-address/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['teacher_address'].setValue(r.data.teacher_address);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateData(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      teacher_address: form.teacher_address
    };
    this.appService.putData('teacher-address/update/'+this.addressID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
