import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-invoice-update',
  templateUrl: './invoice-update.component.html',
  styleUrls: ['./invoice-update.component.css']
})
export class InvoiceUpdateComponent implements OnInit,OnDestroy {

  invoiceID:any;
  invoice:any;
  form: FormGroup;
  destroy$ = new Subject();
  customers:any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      bill_from: ['', Validators.required],
      bill_to: ['', Validators.required],
      pay_to: ['', Validators.required],
      pickup_city: ['', Validators.required],
      delivery_city: ['', Validators.required],
      due_date: ['', Validators.required],
      amount: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.invoiceID = this.route.snapshot.params['idInvoice'];
    this.getInvoiceInfo(this.invoiceID);
    this.getCustomers();
  }
  ngOnDestroy() {
    this.destroy$.complete();
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
  getInvoiceInfo(id:number){
    this.appService.getData('invoice/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.invoice = r.data;
        this.form.controls['bill_from'].setValue(r.data.bill_from);
        this.form.controls['bill_to'].setValue(r.data.bill_to);
        this.form.controls['pay_to'].setValue(r.data.pay_to);
        this.form.controls['pickup_city'].setValue(r.data.pickup_city);
        this.form.controls['delivery_city'].setValue(r.data.delivery_city);
        this.form.controls['due_date'].setValue(r.data.due_date);
        this.form.controls['amount'].setValue(r.data.amount);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateInvoice(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      bill_from: form.bill_from,
      bill_to: form.bill_to,
      pay_to: form.pay_to,
      pickup_city: form.pickup_city,
      delivery_city: form.delivery_city,
      due_date: form.due_date,
      amount: form.amount,
      customer_id:$('#customer_id').val()
    };
    this.appService.putData('invoice/update/'+this.invoiceID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
