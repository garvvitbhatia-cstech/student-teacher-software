import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher-pay-now',
  templateUrl: './teacher-pay-now.component.html',
  styleUrls: ['./teacher-pay-now.component.css']
})
export class TeacherPayNowComponent implements OnInit {

  PayID:any;
  user:any;
  form: FormGroup;
  orders:any;
  totalAmt: any;
  destroy$ = new Subject();
  searchIDs: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      searchIDs: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.PayID = this.route.snapshot.params['payID'];
    const data = {
      token: localStorage.getItem('token'),
      pay_id: this.PayID,
      search_date: '',
    };
    this.getUserInfo(data);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  calculatePrice(){
    var searchIDs:any = [];
    var totalAmt:any = 0;
      $("input:checkbox[name=order]:checked").each(function() {
        searchIDs.push($(this).val());
        var amt:any = $(this).attr('attr-amt');
        totalAmt = parseFloat(amt)+parseFloat(totalAmt);
      });

      this.totalAmt = parseFloat(totalAmt);
      this.searchIDs = searchIDs;
      $('#TotalPayable span').html(totalAmt.toFixed(2));
      if(totalAmt > 0){
        $('#submitBtn').show();
      }else{
        $('#submitBtn').hide();
      }
  }

  getUserInfo(form:any){
    this.appService.postData('settlement/orders/get',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.orders = r.data;
        setTimeout(() => {
          this.calculatePrice();
        }, 300);

      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  payNow(){
    $('#submitBtn').html('Processing');

    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        const data = {
          token: localStorage.getItem('token'),
          searchIDs: this.searchIDs,
          teacher_id: this.PayID
        };
        this.appService.postData('settlement/pay/now',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
          $('#submitBtn').html('Pay Now');
          if(r.success){
            this.searchData();
            this.toastr.success(r.message,"Success");

          }else{
            this.toastr.error(r.message,"Error");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Cancelled Payment Process.',
          'error'
        )
      }
      })
  }
  searchData(){
    const data = {
      token: localStorage.getItem('token'),
      search_date: $("#search_date").val(),
      pay_id: this.PayID,
    };
    this.getUserInfo(data);
  }
  reset(){
    const data = {
      token: localStorage.getItem('token'),
      pay_id: this.PayID,
      search_date: ''
    };
    this.getUserInfo(data);
  }
}
