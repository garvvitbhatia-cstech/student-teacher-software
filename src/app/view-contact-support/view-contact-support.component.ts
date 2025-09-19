import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-view-contact-support',
  templateUrl: './view-contact-support.component.html',
  styleUrls: ['./view-contact-support.component.css']
})
export class ViewContactSupportComponent implements OnInit,OnDestroy {

  person:any;
  form: FormGroup;
  destroy$ = new Subject();
  contactID:any;
  contactData:any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    ) {
      this.form = this.fb.group({
        reply: ['', Validators.required],
      });
     }

  ngOnInit(): void {
    this.contactID = this.route.snapshot.params['idContact'];
    this.getData(this.contactID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getData(id:number){
    this.appService.getData('contact-support/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.contactData = r.data;
    });
  }
  updateProfile(form: any){
    $('#updateBtn').html('Processing');
    const data = {
      token:localStorage.getItem('token'),
      reply: form.reply
    };
    this.appService.putData('contact-support/update/'+this.contactID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#updateBtn').html('Send');
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
  

}
