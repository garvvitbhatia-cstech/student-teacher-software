import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit,OnDestroy {
  SiteUrl = environment.serviceUrl;
  orders:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  subjects:any;
  classes:any;
  boards:any;
  packages:any;

  stateList:any;
  cityList:any;
  f_subjects:any;
  f_classes:any;
  f_boards:any;
  f_tutors:any;
  selectedDay:any = [];

  selectedTutorName:any = 'N/A';
  selectedTutorAddress:any = 'N/A';
  selectedTutorImage:any;
  selectedTutorRating:any = '0';

  login_user_type = localStorage.getItem('login_user_type');
  export_p:any;
  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder,
    ) {

     }

  ngOnInit(): void {
    this.getList();
    this.getStates();
    this.getClasses();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  deleteOrder(orderID: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        
        const data = {
          orderID:orderID,
          token: localStorage.getItem('token'),
        };
        this.appService.postData('order/delete',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
          var r:any=res;
          if(r.success){
            this.getList();
            Swal.fire('Removed!', 'Order removed successfully.', 'success');
          }else{
            this.toastr.error("Board not loading","Error");
          }
        },error=>{
          this.toastr.error("Server Error","Error");
        });

        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Order still in our database.', 'error');
      }
    });
  }
  selectTutor(phone:any){
    $('#teacher_phone').val(phone);
    this.loadTeacherData();
    this.toastr.success("Tutor selected successfully","Success");
    //$('#tutorModal').trigger('click');
  }
  searchTutor(){
    const data = {
      search_state_id:$('#search_state_id').val(),
      search_city_id:$('#search_city_id').val(),
      search_class:$('#search_class').val(),
      search_subjects:$('#search_subjects').val(),
      search_board:$('#search_board').val(),
      search_tutor_name:$('#search_tutor_name').val(),
      search_tutor_email:$('#search_tutor_email').val(),
      search_tutor_phone:$('#search_tutor_phone').val(),
      search_tutor_address:$('#search_tutor_address').val(),
      token: localStorage.getItem('token'),
    };
    this.appService.postData('get/state/tutors',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.f_tutors = r.users;
      }else{
        this.toastr.error("Board not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getClasses() {
    this.appService
      .getData('get/classes/list/add/1')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          if (r.success) {
            this.f_classes = r.users;
          } else {
            this.toastr.error('Carrier not loading', 'Error');
          }
        },
        (error) => {
          this.toastr.error('Server Error', 'Error');
        }
      );
  }
  getBoards(){
    var state_id = $('#search_state_id').val();
    const data = {
      state_id:state_id,
      token: localStorage.getItem('token'),
    };
    this.appService.postData('get/state/board',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.f_boards = r.users;
      }else{
        this.toastr.error("Board not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getSubjects(){
    var state_id = $('#search_state_id').val();
    const data = {
      state_id:state_id,
      token: localStorage.getItem('token'),
    };
    this.appService.postData('get/state/subjects',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.f_subjects = r.users;
      }else{
        this.toastr.error("Carrier not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getStates(){
    const data = {
      token: localStorage.getItem('token')
    };
    this.appService.getData('get/states/list').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.stateList = r.users;
      }else{
        this.toastr.error("State not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getCitiies(){
    var value = $('#search_state_id').val();
    const data = {
      value:value,
      token: localStorage.getItem('token'),
    };
    this.appService.postData('get/cities/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.getBoards();
      this.getSubjects();
      if(r.success){
        this.cityList = r.users;
      }else{
        this.toastr.error("City not loading","Error");
      }
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
    };
    this.appService.postData('orders/get/csv',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#exportBtn').html('Export');
      window.location.href = r.download_url;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getList(){
    const data = {
      token: localStorage.getItem('token'),
      page: this.p,
      bookingID:0,
      start_date: $("#start_date").val(),
      end_date: $("#end_date").val(),
      order_no: $("#order_no").val(),
      teacher_data: $("#teacher_data").val(),
      student_data: $("#student_data").val(),
      payment_status: $("#payment_status").val(),
      teacher_accept_status: $("#teacher_accept_status").val(),
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('orders/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
        this.orders = r.data.data;
        this.total = r.data.total;
        $('#searchStudentBtn').html('Search');

    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getPackages(){
    var subject_id:any = $("#subject_id").val();
    var class_id:any = $("#class_id").val();
    var board_id:any = $("#board_id").val();
    if(subject_id > 0 && class_id > 0 && board_id > 0){
      const data = {
        token: localStorage.getItem('token'),
        subject_id: $("#subject_id").val(),
        class_id: $("#class_id").val(),
        board_id: $("#board_id").val(),
      };
      this.appService.postData('get/order/package',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
          if(r.success){
            this.packages = r.packages;
          }else{
            this.toastr.error(r.message,"Error");
          }
  
      },error=>{
        this.toastr.error("Server Error","Error");
      });

    }
  }
  onChangeDays(event:any,day:any) {
    if(event.target.checked){
      this.selectedDay.push(day);
      //this.invoiceRow.push(invoiceID);
    }else{
      const index = this.selectedDay.findIndex(function(selectedRow:any) {
        return selectedRow == day
      });
      //const index = this.invoiceRow.indexOf(invoiceID);
      if (index > -1) { // only splice array when item is found
        this.selectedDay.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
  }
  loadTeacherData(){
    const data = {
      token: localStorage.getItem('token'),
      teacher_phone: $("#teacher_phone").val(),
    };
    this.appService.postData('teacher/data/search',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
        
        if(r.success){
          this.subjects = r.subjects;
          this.classes = r.classes;
          this.boards = r.boards;
          this.selectedTutorName = r.name;
          this.selectedTutorAddress = r.address;
          this.selectedTutorImage = r.profile_image;
          this.selectedTutorRating = r.rating;
        }else{
          this.toastr.error(r.message,"Error");
        }

    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  createBooking(){
    $('#createBookingBtn').html('Processing..');
    const data = {
      token: localStorage.getItem('token'),
      student_name: $("#student_name").val(),
      student_email: $("#student_email").val(),
      student_phone: $("#student_phone").val(),
      teacher_phone: $("#teacher_phone").val(),
      subject_id: $("#subject_id").val(),
      class_id: $("#class_id").val(),
      board_id: $("#board_id").val(),
      package_id: $("#package_id").val(),
      booking_date_time: $("#booking_date_time").val(),
      custom_amt: $("#custom_amt").val(),
      off_days: this.selectedDay
    };
    this.appService.postData('orders/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
        $('#createBookingBtn').html('Submit');
        if(r.success){
          $("#student_phone").val('');
          $("#teacher_phone").val('');
          this.toastr.success(r.message,"Success");
          this.getList();
        }else{
          this.toastr.error(r.message,"Error");
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
    this.getList();
  }
  searchData(){
    $('#searchStudentBtn').html('Searching..');
    const data = {
      token: localStorage.getItem('token'),
      start_date: $("#start_date").val(),
      end_date: $("#end_date").val(),
      order_no: $("#order_no").val(),
      teacher_data: $("#teacher_data").val(),
      student_data: $("#student_data").val(),
      payment_status: $("#payment_status").val(),
      teacher_accept_status: $("#teacher_accept_status").val(),
      page: this.p,
      bookingID:0
    };
    this.getListFromServer(data);
  }
  reset(){
    $("#start_date").val('');
    $("#end_date").val('');
    $("#order_no").val('');
    $("#teacher_data").val('');
    $("#student_data").val('');
    $("#payment_status").val('');
    $("#teacher_accept_status").val('');
    const data = {
      token: localStorage.getItem('token'),
      start_date: '',
      end_date: '',
      order_no: '',
      teacher_data: '',
      student_data: '',
      payment_status: '',
      teacher_accept_status: '',
      page: this.p,
      bookingID:0
    };
    this.getListFromServer(data);
  }

}

