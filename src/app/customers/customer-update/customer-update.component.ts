import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.css']
})
export class CustomerUpdateComponent implements OnInit,OnDestroy {

  userID:any;
  user:any;
  form: FormGroup;
  destroy$ = new Subject();
  countries:any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      zipcode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userID = this.route.snapshot.params['idUser'];
    this.getUserInfo(this.userID);
    this.getCountries();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getCountries(){
    this.appService.getData('countries/get').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.countries = r.data;
    });
  }
  getUserInfo(id:number){
    this.appService.getData('customer/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.user = r.data;
        this.form.controls['name'].setValue(r.data.name);
        this.form.controls['email'].setValue(r.data.email);
        this.form.controls['phone'].setValue(r.data.phone);
        this.form.controls['address'].setValue(r.data.address);
        this.form.controls['zipcode'].setValue(r.data.zipcode);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateUser(form: any){
    $('#submitBtn').html('Processing');
    var file_data = $('#profile_image').prop('files')[0];
    var submitForm  = new FormData();
    submitForm.append('token',localStorage.getItem('token') as string);
    submitForm.append('name',$('#name').val() as string);
    submitForm.append('email',$('#email').val() as string);
    submitForm.append('password',$('#password').val() as string);
    submitForm.append('phone',$('#phone').val() as string);
    submitForm.append('address',$('#address').val() as string);
    submitForm.append('zipcode',$('#zipcode').val() as string);
    submitForm.append('file',file_data);

    this.appService.postData('customer/update/'+this.userID,submitForm).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
