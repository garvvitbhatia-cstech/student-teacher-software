import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy {

  person:any;
  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
    ) {
      this.form = this.fb.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
      });
     }

  ngOnInit(): void {
    this.getProfile();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getProfile(){
    this.appService.getData('profile/details/get').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.person = r.data;
      this.form.controls['name'].setValue(r.data.name);
      this.form.controls['email'].setValue(r.data.email);
    });
  }
  updateProfile(form: any){
    $('#updateBtn').html('Processing');
    const data = {
      token:localStorage.getItem('token'),
      name: form.name,
    };
    this.appService.postData('profile/details/update',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#updateBtn').html('Update');
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
  generateAPIKey(){
    $('#generteBtn').html('Processing...');
    const data = {
      token:localStorage.getItem('token')
    };
    this.appService.postData('generate/api/key',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#generteBtn').html('Re-Generate API Key');
      this.getProfile();
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }

}
