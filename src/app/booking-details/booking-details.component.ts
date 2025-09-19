import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit,OnDestroy {
  
  orders:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  bookingID:any;
  OrderData:any;
  teacherData:any;
  studentData:any;
  packData:any;
  login_user_type = localStorage.getItem('login_user_type');
  export_p:any;

  total_earning: number = 0;
  no_of_tution_completed: number = 0;
  one_day_earning: number = 0;
  monthly_earning: number = 0;
  commission = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    ) {

     }

  ngOnInit(): void {
    this.bookingID = this.route.snapshot.params['bookingID'];
    this.getList(this.bookingID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  createMoreSession(){
    if($('#booking_date_time').val() == ''){
      this.toastr.error("Enter session date time","Error");
    }else{
      const data = {
        token: localStorage.getItem('token'),
        order_id: this.bookingID,
        booking_date_time: $('#booking_date_time').val()
      };
      this.appService.postData('new/session/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        if(r.success){
          this.toastr.success(r.message,"Success");
        }else{
          this.toastr.error(r.message,"Error");
        }
        
      },error=>{
        this.toastr.error("Server Error","Error");
      });
    }
  }
  StartSession(orderID:number){
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
          booking_id: orderID,
        };
        this.appService.postData('order/start/session',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
          var r:any=res;
          if(r.success){
            this.getList(this.bookingID);
            Swal.fire(
              'Success!',
              'Session start successfully.',
              'success'
            )
          }else{
            this.toastr.error(r.message,"Error");
          }
          
        },error=>{
          this.toastr.error("Server Error","Error");
        });
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Class still in our database.',
        'error'
      )
      }
      })
  }
  UpdateOrderStatus(orderID:number,column:any){
    if(column == 'order_status'){
      var value = $('#order_status_'+orderID).val();
    }
    if(column == 'teacher_accept_status'){
      var value = $('#teacher_accept_status_'+orderID).val();
    }
    if(column == 'new_time'){
      var value = $('#new_time_'+orderID).val();
    }
    if(column == 're_schedule_type'){
      var value = $('#re_schedule_type_'+orderID).val();
    }
    if(column == 'class_adjust'){
      var value = $('#class_adjust_'+orderID).val();
    }
    const data = {
      token: localStorage.getItem('token'),
      orderID: orderID,
      column: column,
      value:value
    };
    this.appService.postData('update/order/data',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.toastr.success(r.message,"Success");
      this.getList(this.bookingID);
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  exportCSV(){
    $('#exportBtn').html('Processing...');
    const data = {
      token: localStorage.getItem('token'),
      order_no: $("#order_no").val(),
      start_date: $("#start_date").val(),
      end_date: $("#end_date").val(),
      bookingID: this.route.snapshot.params['bookingID']
    };
    this.appService.postData('orders/booking-details/csv',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#exportBtn').html('Export');
      window.location.href = r.download_url;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getList(bookingID:number){
    const data = {
      token: localStorage.getItem('token'),
      page: this.p,
      bookingID:bookingID,
      start_date: $("#start_date").val(),
      end_date: $("#end_date").val(),
      order_no: $("#order_no").val(),
    };
    this.getListFromServer(data);
  }
  updateData(){
    $('#order_update_btn').html('Processing...');
    const data = {
      token: localStorage.getItem('token'),
      bookingID:this.bookingID,
      tutor_accept_status: $("#tutor_accept_status").val(),
      payment_status: $("#payment_status").val(),
      order_status: $("#order_status").val(),
      booking_start_time: $("#booking_start_time").val(),
      booking_end_time: $("#booking_end_time").val(),
      commission_type: $("#commission_type").val(),
      commission: $("#commission").val(),
      extra_class: $("#extra_class").val(),
      amount: $("#amount").val(),
    };
    this.appService.postData('order/update',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#order_update_btn').html('Update');
      if(r.success){
        $("#extra_class").val(0);
       this.getList(this.bookingID);
        this.toastr.success(r.message,"Success");
       
      }else{
        this.toastr.error(r.message,"Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getListFromServer(form:any){
    this.appService.postData('orders/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
        this.orders = r.data.data;
        this.total = r.data.total;
        this.OrderData = r.OrderData;
        this.teacherData = r.teacherData;
        this.studentData = r.studentData;
        this.packData = r.packData;

        this.total_earning = r.total_earning;
        this.no_of_tution_completed = r.no_of_tution_completed;
        this.one_day_earning = r.one_day_earning;
        this.monthly_earning = r.monthly_earning;

        if(r.teacherData.current_latitude != "" && r.teacherData.current_latitude != null){
          $('#tutor_location').attr('src','https://maps.google.com/maps?q='+r.teacherData.current_latitude+','+r.teacherData.current_longitude+'&hl=es;z=14&output=embed');
        }else{
          $('#tutor_location').attr('src','https://maps.google.com/maps?q=23.146950,77.480540&hl=es;z=14&output=embed');
        }
        if(r.studentData.current_latitude != "" && r.studentData.current_latitude != null){
          $('#student_location').attr('src','https://maps.google.com/maps?q='+r.studentData.current_latitude+','+r.studentData.current_longitude+'&hl=es;z=14&output=embed');
        }else{
          $('#student_location').attr('src','https://maps.google.com/maps?q=23.146950,77.480540&hl=es;z=14&output=embed');
        }
        

        $('#searchStudentBtn').html('Search');
        
        $('#tutor_accept_status').val(r.OrderData.teacher_accept_status);
        $('#payment_status').val(r.OrderData.payment_status);
        $('#order_status').val(r.OrderData.order_status);
        $('#booking_start_time').val(r.OrderData.booking_time);
        $('#booking_end_time').val(r.OrderData.booking_end_time);
        $('#amount').val(r.OrderData.amount);
        if(r.OrderData.commission_type == 'Percentage'){
          $('#commission').val(r.OrderData.commission);
        }else{
          $('#commission').val(r.OrderData.company_commission);
        }
        

    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  /**
   * Write code on Method
   *
   * @return response()
   */
   pageChangeEvent(event: number){
    this.p = event;
    this.getList(this.bookingID);
  }
  searchData(){
    $('#searchStudentBtn').html('Searching..');
    const data = {
      token: localStorage.getItem('token'),
      start_date: $("#start_date").val(),
      end_date: $("#end_date").val(),
      order_no: $("#order_no").val(),
      bookingID:this.bookingID,
      page: this.p
    };
    this.getListFromServer(data);
  }
  reset(){
    $("#order_no").val('');
    $("#end_date").val('');
    $("#end_date").val('');
    const data = {
      token: localStorage.getItem('token'),
      start_date: '',
      end_date: '',
      order_no:'',
      page: this.p,
      bookingID:this.bookingID
    };
    this.getListFromServer(data);
  }

}


