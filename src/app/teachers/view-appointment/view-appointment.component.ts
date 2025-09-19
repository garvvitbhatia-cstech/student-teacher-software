import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.css']
})
export class ViewAppointmentComponent implements OnInit {

  userID:any;
  user:any;
  form: FormGroup;
  classes:any;
  boards:any;
  subjects:any;
  franchises:any;
  destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      telecaller_name: ['', Validators.required],
      call_date: ['', Validators.required],
      name: ['', Validators.required],
      contact: ['', Validators.required],
      appointment_date: ['', Validators.required],
      time_slot: ['', Validators.required],
      reschedule_appointment_date: ['', Validators.required],
      rtime_slot: ['', Validators.required],
      city_id: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getAllFranchise();
    this.userID = this.route.snapshot.params['idAppointment'];
    this.getUserInfo(this.userID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getAllFranchise(){
    var form = {token: localStorage.getItem('token')};
    this.appService.postData('franchise/list/all',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.franchises = r.users;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getUserInfo(id:number){
    this.appService.getData('appointments/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['telecaller_name'].setValue(r.data.telecaller_name);
        this.form.controls['call_date'].setValue(r.data.call_date);
        this.form.controls['name'].setValue(r.data.name);
        this.form.controls['contact'].setValue(r.data.contact);
        this.form.controls['appointment_date'].setValue(r.data.appointment_date);
        this.form.controls['time_slot'].setValue(r.data.time_slot);
        this.form.controls['reschedule_appointment_date'].setValue(r.data.reschedule_appointment_date);
        this.form.controls['rtime_slot'].setValue(r.data.rtime_slot);
        this.form.controls['city_id'].setValue(r.data.city_id);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }

  updateSubject(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      name: form.name,
      contact: form.contact,
      appointment_date: form.appointment_date,
      time_slot: form.time_slot,
      city_id:form.city_id
      //classes: form.classes
    };
    this.appService.putData('appointment/update/'+this.userID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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