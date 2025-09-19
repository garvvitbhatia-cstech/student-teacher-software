import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from, noop, of, Subject } from 'rxjs';
import { map, mergeAll, mergeMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
})
export class TeachersComponent implements OnInit, OnDestroy {
  SiteUrl = environment.serviceUrl;
  users: any;
  p: number = 1;
  total: number = 0;
  sendMailCount:number = 0;
  smsCount:number=0;
  login_user_type = localStorage.getItem('login_user_type');
  destroy$ = new Subject();

  add_p:any;
  edit_p:any;
  view_p:any;
  delete_p:any;
  export_p:any;
  import_p:any;
  self_p:any;

  classes:any;
  boards:any;
  subjects:any;
  stateList:any;
  cityList:any;

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
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getList();
    this.getClasses();
    this.getStates();
  }
  ngOnDestroy() {
    this.destroy$.complete();
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
      token: localStorage.getItem('token'),
      id: $('#row_id').val(),
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
    var value = $('#state_id').val();
    const data = {
      value:value,
      token: localStorage.getItem('token'),
    };
    this.appService.postData('get/cities/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.cityList = r.users;
      }else{
        this.toastr.error("City not loading","Error");
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
            this.classes = r.users;
            this.getBoards();
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
    this.appService.getData('get/boards/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.boards = r.users;
        this.getSubjects();
      }else{
        this.toastr.error("Board not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getSubjects(){
    this.appService.getData('get/subjects/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.subjects = r.users;
      }else{
        this.toastr.error("Carrier not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  exportCSV(){
    $('#exportBtn').html('Processing...');
    const data = {
      token: localStorage.getItem('token')
    };
    this.appService.postData('super/admins/get/csv',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#exportBtn').html('Export CSV');
      window.location.href = r.download_url;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  uploadData(){
    $('#uploadBtn').html('Processing');
    var file_data = $('#file').prop('files')[0];
    var submitForm  = new FormData();
    submitForm.append('token',localStorage.getItem('token') as string);
    submitForm.append('file',file_data);

    this.appService.postData('super/admins/upload',submitForm).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#uploadBtn').html('Upload');
        this.toastr.success(r.message,"Success");
        this.getList();
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getList() {
    const data = {
      token: localStorage.getItem('token'),
      page: this.p,
      email: $('#f_email').val(),
      phone: $('#f_phone').val(),
      name: $('#f_name').val(),
      class_id: $("#f_class").val(),
      subject: $("#f_subjects").val(),
      board: $("#f_board").val(),
      profile_image:$('#f_profile_image').val(),
      email_exist:$('#f_email_exist').val(),
      city_id: $("#city_id").val(),
      address: $("#f_address").val(),
      beneficiary_id:$("#f_beneficiary_id").val(),
      f_gender:$("#f_gender").val(),
      rating:$("#f_rating").val(),
      f_home_location:$("#f_home_location").val(),
    };
    this.getListFromServer(data);
  }
  getListFromServer(form: any) {
    this.appService
      .postData('super/admins/list', form)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          if (r.permission) {
            this.users = r.users.data;
            this.total = r.users.total;
            this.sendMailCount = r.sendMailCount;
            this.smsCount = r.smsCount;

            this.add_p = r.access.add;
            this.edit_p = r.access.edit;
            this.view_p = r.access.view;
            this.delete_p = r.access.delete;
            this.export_p = r.access.export;
            this.import_p = r.access.import;
            this.self_p = r.access.self;

          } else {
            this.router.navigateByUrl('/dashboard');
          }
        },
        (error) => {
          this.toastr.error('Server Error', 'Error');
        }
      );
  }
  /**
   * Write code on Method
   *
   * @return response()
   */
  pageChangeEvent(event: number) {
    this.p = event;
    this.getList();
  }
  updateStatus(userID: string, status: string) {
    const data = {};
    this.appService
      .putData('super/admin/status/update/' + userID + '/' + status, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          this.getList();
        },
        (error) => {
          this.toastr.error('Server Error', 'Error');
        }
      );
  }
  updateApproveStatus(userID: string, status: string) {
    const data = {};
    this.appService
      .putData('super/admin/approve/status/update/' + userID + '/' + status, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          this.getList();
        },
        (error) => {
          this.toastr.error('Server Error', 'Error');
        }
      );
  }
  deleteUser(userID: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.updateStatus(userID, '3');
        Swal.fire('Removed!', 'User removed successfully.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Product still in our database.', 'error');
      }
    });
  }
  searchData() {
    const data = {
      token: localStorage.getItem('token'),
      email: $('#f_email').val(),
      phone: $('#f_phone').val(),
      name: $('#f_name').val(),
      profile_image:$('#f_profile_image').val(),
      email_exist:$('#f_email_exist').val(),
      class_id: $("#f_class").val(),
      subject: $("#f_subjects").val(),
      board: $("#f_board").val(),
      city_id: $("#city_id").val(),
      address: $("#f_address").val(),
      beneficiary_id:$("#f_beneficiary_id").val(),
      f_gender:$("#f_gender").val(),
      rating:$("#f_rating").val(),
      f_home_location:$("#f_home_location").val(),
      page: this.p,
    };
    this.getListFromServer(data);
  }
  reset() {
    $('#f_name').val('');
    $('#f_email').val('');
    $('#f_phone').val('');
    $('#f_profile_image').val('');
    $('#f_beneficiary_id').val('');
    $('#f_email_exist').val('');
    $('#f_class').val('');
    $('#f_subjects').val('');
    $('#f_board').val('');
    $('#city_id').val('');
    $('#state_id').val('');
    $('#f_address').val('');
    $('#f_gender').val('');
    $('#f_rating').val('');
    $('#f_home_location').val('');
    const data = {
      token: localStorage.getItem('token'),
      name: '',
      email: '',
      phone: '',
      profile_image: '',
      beneficiary_id:'',
      email_exist:'',
      class_id:'',
      subject:'',
      board:'',
      city_id:'',
      address:'',
      f_gender:'',
      f_home_location:'',
      rating:'',
      page: 1,
    };
    this.getListFromServer(data);
  }
}
