import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css']
})
export class InvoiceCreateComponent implements OnInit,OnDestroy {

  form: FormGroup;
  destroy$ = new Subject();
  customers:any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    public fb: FormBuilder,
  ) { 
    this.form = this.fb.group({
      bill_from: ['', Validators.required],
      bill_to: ['', Validators.required],
      pay_to: ['', Validators.required],
      pickup_city: ['', Validators.required],
      delivery_city: ['', Validators.required],
      due_date: ['', Validators.required],
      amount: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkPermission();
    this.getCustomers();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  checkPermission(){
    this.appService.getData('check/permission/3').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){}else{
        this.router.navigateByUrl('/dashboard');
      }
    });
  }
  getCustomers(){
    this.appService.getData('get/customer/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.customers = r.users;
      }else{
        this.toastr.error("Customer not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  createInvoice(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      bill_from: form.bill_from,
      bill_to: form.bill_to,
      pay_to: form.pay_to,
      pickup_city: form.pickup_city,
      delivery_city: form.delivery_city,
      due_date: form.due_date,
      amount: form.amount,
      customer_id: $('#customer_id').val()
    };
    this.appService.postData('invoice/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('invoices');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }

}
