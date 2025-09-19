import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-teacher-address-create',
  templateUrl: './teacher-address-create.component.html',
  styleUrls: ['./teacher-address-create.component.css']
})
export class TeacherAddressCreateComponent implements OnInit {

  teacherID:any;
  destroy$ = new Subject();
  form: FormGroup;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    private route: ActivatedRoute,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      teacher_address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.teacherID = this.route.snapshot.params['idTeacher'];
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
  createData(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      teacher_address: form.teacher_address,
    };
    this.appService.postData('teacher-address/create/'+this.teacherID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('/teacher-addresses/'+this.teacherID);
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }

}
