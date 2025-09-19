import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit,OnDestroy {
  invoices:any;
  userType:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder,
    ) {

     }

    ngOnInit(): void {
      this.getList();
    }
    ngOnDestroy() {
      this.destroy$.complete();
    }
    getList(){
      const data = {
        token: localStorage.getItem('token'),
        page: this.p
      };
      this.getListFromServer(data);
    }
    loadPay(id:number){
      $('#PayPopUp').addClass('in');
      $('#PayPopUp').css('display','block');
      $('#payInvoiceID').val(id);
    }
    getListFromServer(form:any){
      this.appService.postData('invoice/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        if(r.permission){
          this.invoices = r.invoices.data;
          this.total = r.invoices.total;
          this.userType = r.type;
        }else{
          this.router.navigateByUrl('/dashboard');
        }
      },error=>{
        this.toastr.error("Server Error","Error");
      });
    }
    searchData(){
      const data = {
        token: localStorage.getItem('token'),
        bill_from: $("#bill_from").val(),
        bill_to: $("#bill_to").val(),
        page: this.p
      };
      this.getListFromServer(data);
    }
    reset(){
      const data = {
        token: localStorage.getItem('token'),
        bill_from: '',
        bill_to: '',
        page: this.p
      };
      this.getListFromServer(data);
    }
    deleteUser(invoiceID:string){
      Swal.fire({
        title: 'Are you sure?',
        text: 'This process is irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
        }).then((result) => {
        if (result.value) {
          this.appService.deleteData('invoice/delete/'+invoiceID).pipe(takeUntil(this.destroy$)).subscribe(res=>{
            var r:any=res;
            Swal.fire(
              'Removed!',
              'User removed successfully.',
              'success'
            );
            this.getList();
          },error=>{
            this.toastr.error("Server Error","Error");
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Product still in our database.',
          'error'
        )
        }
        })
    }
    updateStatus(invoiceID:string,status:string){
      if(status == '2'){
        $('#reasonPopUp').addClass('in');
        $('#reasonPopUp').css('display','block');
        $('#reasonText').focus();
        $('#invoiceID').val(invoiceID);
      }else{
        Swal.fire({
          title: 'Are you sure?',
          text: 'This process is irreversible.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              const data = {};
              this.appService.putData('invoice/update/status/'+invoiceID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
                var r:any=res;
                Swal.fire(
                  'Updated!',
                  'Status changed successfully.',
                  'success'
                );
                this.getList();
              },error=>{
                this.toastr.error("Server Error","Error");
              });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelled',
                '',
                'error'
              );
              this.getList();
            }
        })
      }
    }
    saveReason(){
      $('#reasonBtn').html('Processing');
      const data = {};
      this.appService.putData('invoice/reason/update/'+$("#invoiceID").val()+'/'+$("#reasonText").val(),data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        $('#reasonBtn').html('Submit');
        $("#reasonText").val('');
        this.closePopup();
        Swal.fire(
          'Updated!',
          'Reason successfully.',
          'success'
        );
        this.getList();
      },error=>{
        this.toastr.error("Server Error","Error");
      });
    }
    closePopup(){
      $('#reasonPopUp').removeClass('in');
      $('#reasonPopUp').css('display','none');
    }
    pageChangeEvent(event: number){
      this.p = event;
      this.getList();
    }

}
