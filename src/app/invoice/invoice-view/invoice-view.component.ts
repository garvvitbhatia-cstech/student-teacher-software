import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit,OnDestroy {

  invoiceID:any;
  destroy$ = new Subject();
  invoiceData:any;
  paidInvoices:any;
  totalAmt:any;
  totalDueAmt:any;
  payableData:any;

  private SiteUrl = environment.serviceUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
    private http:HttpClient
  ) { }

  ngOnInit(): void {
    this.invoiceID = this.route.snapshot.params['idInvoice'];
    this.getInvoiceInfo(this.invoiceID);
    this.getPaybaleInvoiceList();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getPaybaleInvoiceList(){
    const data = {
      token: localStorage.getItem('token'),
      invoice_id: this.invoiceID
    };
    this.appService.postData('invoice/payable/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.paidInvoices = r.data;
      this.totalAmt = r.total_amt;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getInvoiceInfo(id:number){
    this.appService.getData('invoice/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.invoiceData = r.data;
        this.totalDueAmt = r.total_due_amount;
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  payNow(){
    $('#payNowBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      invoice_id: this.invoiceID,
      type: $('#type').val(),
      amount: $('#amount').val(),
      comment: $('#comment').val(),
      quantity: $('#quantity').val(),
      invoice_type: $('#invoice_type').val(),
      number: $('#number').val()
    };
    this.appService.postData('invoice/pay',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#payNowBtn').html('Submit');
      if(r.success){
        $('#amount').val('');
        $('#number').val('');
        this.getPaybaleInvoiceList();
        this.getInvoiceInfo(this.invoiceID);
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
  deletePayable(id:any){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        this.deleteData(id,'1');
        Swal.fire(
          'Removed!',
          'Record removed successfully.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Record still in our database.',
        'error'
      )
      }
      })
  }
  deleteData(id:string,status:string){
    const data = {};
    this.appService.putData('invoice/payable/delete/'+id+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.getPaybaleInvoiceList();
      this.getInvoiceInfo(this.invoiceID);
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  editPayable(id:any){
    $('#editPayablePopUp').addClass('in');
    $('#editPayablePopUp').css('display','block');
    $('#payableID').val(id);

    this.appService.getData('invoice/payable/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.payableData = r.data;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  closePopup(){
    $('#editPayablePopUp').removeClass('in');
    $('#editPayablePopUp').css('display','none');
  }
  updatePayable(){
    $('#updatePayableBtn').html('Processing');
    const data = {
      type: $('#type_edit').val(),
      amount: $('#amount_edit').val(),
      comment: $('#comment_edit').val(),
      quantity: $('#quantity_edit').val(),
      invoice_type: $('#invoice_type_edit').val(),
      number: $('#number_edit').val()
    };
    this.appService.putData('invoice/payable/update/'+$('#payableID').val(),data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#updatePayableBtn').html('Update');
      if(r.success){
        this.getPaybaleInvoiceList();
        this.getInvoiceInfo(this.invoiceID);
        this.toastr.success(r.message,"Success");
        this.closePopup();
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
  generatePDF(invoiceID:any){
    $('#DownloadBtn').html('Downloading...');
    this.appService.getData('invoice/pdf/get/'+invoiceID).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.payableData = r.file_name;
      $('#DownloadBtn').html('Download PDF');
      window.open(this.SiteUrl+'storage/pdf/'+r.file_name, "_blank");
    },error=>{
      this.toastr.error("Server Error","Error");
      $('#DownloadBtn').html('Download PDF');
    });
  }

}
