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
  selector: 'app-payouts',
  templateUrl: './payouts.component.html',
  styleUrls: ['./payouts.component.css']
})
export class PayoutsComponent implements OnInit,OnDestroy {

  SiteUrl = environment.serviceUrl;
  payouts:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  heading:any;
  userID:number = 0;
  totalPay:number=0;
  user:any={phone:0};

  stateList:any;
  cityList:any;
  f_subjects:any;
  f_classes:any;
  f_boards:any;
  f_tutors:any;

  totalEarning:number = 0;
  oneDayEarning:number = 0;
  monthlyEarning:number = 0;
  totalClasses:number = 0;
  total_pay:number = 0;
  pending_pay:number = 0;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    ) {

     }

  ngOnInit(): void {
    this.userID = this.route.snapshot.params['id'];
    if(this.userID > 0){
      this.getTeacherBalance(this.userID);
      this.getUserInfo(this.userID);
    }
    this.getList();
    this.getStates();
    this.getClasses();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  setHeading(){
    this.heading = 'Add Payout';
    this.clearForm();
  }
  clearForm(){
    $('#teacher_phone').val();
    $('#amount').val('');
    $('#pay_date').val('');
    $('#remark').val('');
    $('#pay_type').val('');
  }
  getUserInfo(id:number){
    this.appService.getData('super/admin/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.user = r.data;
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getTeacherBalance(teacherID:number){
    const data = {
      token: localStorage.getItem('token'),
      teacherID: teacherID
    };
    this.appService.postData('super/admins/balance/summary',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.totalEarning = r.total_earning;
        this.oneDayEarning = r.one_day_earning;
        this.monthlyEarning = r.monthly_earning;
        this.totalClasses = r.no_of_tution_completed;
        this.total_pay = r.total_pay;
        this.pending_pay = r.pending_pay;
      }else{
        this.toastr.error("Server Error","Error");
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
  selectTutor(phone:any){
    $('#teacher_phone').val(phone);
    this.toastr.success("Teacher Selected","Success");
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
  
  saveData(){
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      teacher_phone: $('#teacher_phone').val(),
      amount: $('#amount').val(),
      pay_date: $('#pay_date').val(),
      remark: $('#remark').val(),
      pay_type: $('#pay_type').val()
    };
    this.appService.postData('payout/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.clearForm();
        this.toastr.success(r.message,"Success");
        this.getList();
      }else{
        this.toastr.error(r.message,"Error");
      }
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
    this.appService.postData('payouts/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.payouts = r.invoices.data;
      this.total = r.invoices.total;
      this.totalPay = r.totalPay;
      $('#searchStudentBtn').html('Search');
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
  updateStatus(classID:string,status:string){
    const data = {};
    this.appService.putData('payout/status/update/'+classID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.getList();
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  deleteUser(classID:string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        this.updateStatus(classID,'3');
        Swal.fire(
          'Removed!',
          'Customer removed successfully.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Class still in our database.',
        'error'
      )
      }
      })
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