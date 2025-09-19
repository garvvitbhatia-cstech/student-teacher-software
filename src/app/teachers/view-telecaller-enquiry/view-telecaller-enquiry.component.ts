import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-telecaller-enquiry',
  templateUrl: './view-telecaller-enquiry.component.html',
  styleUrls: ['./view-telecaller-enquiry.component.css']
})
export class ViewTelecallerEnquiryComponent implements OnInit,OnDestroy {

  userID:any;
  user:any;
  userData:any;
  form: FormGroup;
  classes:any;
  boards:any;
  subjects:any;
  destroy$ = new Subject();
  interviewers:any;
  telecallers:any;
  franchises:any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      city_id: ['', Validators.required],
      telecaller_name: ['', Validators.required],
      interviewer_name: ['', Validators.required],
      dov: ['', Validators.required],
      shortlisting_category: ['', Validators.required],
      full_name: ['', Validators.required],
      gender: ['', Validators.required],
      current_address: ['', Validators.required],
      mobile: ['', Validators.required],
      whatsaapp: ['', Validators.required],
      email: ['', Validators.required],
      qualification: ['', Validators.required],
      experience: ['', Validators.required],
      tutoring_grades: ['', Validators.required],
      subjects: ['', Validators.required],
      owned_vehicle: ['', Validators.required],
      tutoring_hours: ['', Validators.required],
      preferred_location: ['', Validators.required],
      referred_by: ['', Validators.required],
      working_hours: ['', Validators.required],
      payment_terms: ['', Validators.required],
      tutoring_hours_permission: ['', Validators.required],
      locations: ['', Validators.required],
      t_and_c: ['', Validators.required],
      documentations: ['', Validators.required],
      asked: ['', Validators.required],
      send_email: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getAllFranchise();
    this.userID = this.route.snapshot.params['idEnquiry'];
    this.getUserInfo(this.userID);
    this.getInterViewerList();
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
  updateStatus(faqID:string,status:string){
    const data = {};
    this.appService.putData('telecaller/status/update/'+faqID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        if(status == '3'){
          Swal.fire(
            'Removed!',
            'Record removed successfully.',
            'success'
          )
        }
        this.getUserInfo(this.userID);
      }else{
        Swal.fire(
          'Error',
          r.message,
          'error'
        )
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateSubject(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      city_id:form.city_id,
      telecaller_name: form.telecaller_name,
      interviewer_name: form.interviewer_name,
      dov: form.dov,
      shortlisting_category: form.shortlisting_category,
      full_name: form.full_name,
      gender: form.gender,
      current_address: form.current_address,
      mobile: form.mobile,
      whatsaapp: form.whatsaapp,
      email: form.email,
      qualification: form.qualification,
      experience: form.experience,
      tutoring_grades: form.tutoring_grades,
      subjects: form.subjects,
      owned_vehicle: form.owned_vehicle,
      tutoring_hours: form.tutoring_hours,
      preferred_location: form.preferred_location,
      referred_by: form.referred_by,
      working_hours: form.working_hours,
      payment_terms: form.payment_terms,
      tutoring_hours_permission: form.tutoring_hours_permission,
      locations: form.locations,
      t_and_c: form.t_and_c,
      documentations: form.documentations,
      asked: form.asked,
      send_email:form.send_email
      //classes: form.classes
    };
    this.appService.putData('telecaller/update/'+this.userID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Update');
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
  getInterViewerList(){
    const data = {
      token: localStorage.getItem('token'),
    };
    this.appService.postData('interviwer/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.interviewers = r.users;
      this.telecallers = r.telecallers;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getUserInfo(id:number){
    this.appService.getData('telecaller/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.userData = r.data;
        this.form.controls['telecaller_name'].setValue(r.data.telecaller_name);
        this.form.controls['interviewer_name'].setValue(r.data.interviewer_name);
        this.form.controls['dov'].setValue(r.data.dov);
        this.form.controls['shortlisting_category'].setValue(r.data.shortlisting_category);
        this.form.controls['full_name'].setValue(r.data.full_name);
        this.form.controls['gender'].setValue(r.data.gender);
        this.form.controls['current_address'].setValue(r.data.current_address);
        this.form.controls['mobile'].setValue(r.data.mobile);
        this.form.controls['whatsaapp'].setValue(r.data.whatsaapp);
        this.form.controls['email'].setValue(r.data.email);
        this.form.controls['qualification'].setValue(r.data.qualification);
        this.form.controls['experience'].setValue(r.data.experience);
        this.form.controls['tutoring_grades'].setValue(r.data.tutoring_grades);
        this.form.controls['subjects'].setValue(r.data.subjects);
        this.form.controls['owned_vehicle'].setValue(r.data.owned_vehicle);
        this.form.controls['tutoring_hours'].setValue(r.data.tutoring_hours);
        this.form.controls['preferred_location'].setValue(r.data.preferred_location);
        this.form.controls['referred_by'].setValue(r.data.referred_by);
        this.form.controls['working_hours'].setValue(r.data.working_hours);
        this.form.controls['payment_terms'].setValue(r.data.payment_terms);
        this.form.controls['tutoring_hours_permission'].setValue(r.data.tutoring_hours_permission);
        this.form.controls['locations'].setValue(r.data.locations);
        this.form.controls['t_and_c'].setValue(r.data.t_and_c);
        this.form.controls['documentations'].setValue(r.data.documentations);
        this.form.controls['asked'].setValue(r.data.asked);
        this.form.controls['send_email'].setValue(r.data.send_email);
        this.form.controls['city_id'].setValue(r.data.city_id);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }

}
