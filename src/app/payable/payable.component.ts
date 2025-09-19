import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payable',
  templateUrl: './payable.component.html',
  styleUrls: ['./payable.component.css']
})
export class PayableComponent implements OnInit,OnDestroy {

  SiteUrl = environment.serviceUrl;
  payouts:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  heading:any;
  userID:number = 0;
  totalPay:number=0;
  user:any={phone:0};
  teacherData:any;
  orderData:any;
  payoutData:any;
  rowData:any;
  selectedTeachers:any = [];
  totalTeacherRemainAmt = 0;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    ) {

     }

  ngOnInit(): void {
    
    this.getList();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  setAmountForPay(data:any){
    this.rowData = data;
    $('#row_id').val(data.teacher_id);
    $('#payable_amount').val(data.total_teacher_remaining_structure);
  }
  onChangeDays(event:any,teacher_id:number,total_teacher_remaining_amt:number) {
    if(event.target.checked){
      this.selectedTeachers.push(teacher_id);
      this.totalTeacherRemainAmt = this.totalTeacherRemainAmt+total_teacher_remaining_amt;
    }else{
      const index = this.selectedTeachers.findIndex(function(selectedRow:any) {
        return selectedRow == teacher_id
      });
      //const index = this.invoiceRow.indexOf(invoiceID);
      if (index > -1) { // only splice array when item is found
        this.selectedTeachers.splice(index, 1); // 2nd parameter means remove one item only
        this.totalTeacherRemainAmt = this.totalTeacherRemainAmt-total_teacher_remaining_amt;
      }
    }
    console.log(this.totalTeacherRemainAmt);
  }
  setTeacherData(data:any){
    this.teacherData = data;
  }
  setOrderData(data:any){
    this.orderData = data;
  }
  setPayoutData(data:any){
    this.payoutData = data;
  }
  createBeneficiary(id:number){
    $('#c_beni').html('Processing...');
    var formData = {user_id:id,token:localStorage.getItem('token')};
    this.appService.postData('/super/admin/create/beneficiary',formData).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#c_beni').html('Create Beneficiary');
      this.getList();
      if(r.success){
        this.toastr.success(r.message,"Error");
      }else{
        this.toastr.error(r.message,"Error");
      }

      
    });
  }
  finalBulkPay(){
    const data = {
      token: localStorage.getItem('token'),
      teacher_ids: this.selectedTeachers,
    };
    this.appService.postData('final/bulk/pay',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  finalPay(){
    const data = {
      token: localStorage.getItem('token'),
      teacher_id: $('#row_id').val(),
      payable_amount: $('#payable_amount').val(),
    };
    this.appService.postData('final/pay',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.toastr.success(r.message,"Error");
      }else{
        this.toastr.error(r.message,"Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getList(){
    const data = {
      token: localStorage.getItem('token'),
      page: this.p,
      user_id:this.userID
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('payable/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.payouts = r.invoices;
      this.total = r.invoices.total;
      //this.totalPay = r.totalPay;
      $('#searchStudentBtn').html('Search');
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }

  
  searchData(){
    $('#searchStudentBtn').html('Searching..');
    const data = {
      token: localStorage.getItem('token'),
      title: $("#title").val(),
      page: this.p,
      user_id:this.userID
    };
    this.getListFromServer(data);
  }
  reset(){
    const data = {
      token: localStorage.getItem('token'),
      title: '',
      page: this.p,
      user_id:this.userID
    };
    this.getListFromServer(data);
  }

}
