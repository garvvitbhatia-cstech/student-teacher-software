import { Component, OnInit, OnDestroy,ViewChild  } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student-enquiry',
  templateUrl: './student-enquiry.component.html',
  styleUrls: ['./student-enquiry.component.css']
})
export class StudentEnquiryComponent implements OnInit {

  SiteUrl = environment.serviceUrl;

  users:any;
  franchises:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  heading:any;
  rowData:any;
  total_records: number = 0;
  total_sms_send: number = 0;
  login_user_type = localStorage.getItem('login_user_type');
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

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder,
    ) {

     }

  ngOnInit(): void {
    this.getList();
    this.getAllFranchise();
    this.getStates();
    this.getClasses();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getCitiies(){
    var value = $('#state').val();
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
  getStates(){
    
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
  resetupData(){
    $('#resetupBtn').html('Processing');
    var submitForm  = new FormData();
    submitForm.append('token',localStorage.getItem('token') as string);
    submitForm.append('description_type',$('#description_type').val() as string);

    this.appService.postData('reset/data',submitForm).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#resetupBtn').html('Submit');
        this.toastr.success(r.message,"Success");
        this.getList();
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  sendSms(phone:number,id:number){
    $('#send_btn_'+id).html('Sending...');
    const data = {
      token: localStorage.getItem('token'),
      phone: phone
    };
    this.appService.postData('/student/enquiries/send/sms',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#send_btn_'+id).html('Send');
      this.toastr.success(r.message,"Success");
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getAllFranchise(){
    var form = {token: localStorage.getItem('token')};
    this.appService.postData('franchise/list/all',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.franchises = r.users;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  exportCSV(){
    $('#exportBtn').html('Processing...');
    const data = {
      token: localStorage.getItem('token')
    };
    this.appService.postData('student/enquiries/get/csv',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#exportBtn').html('Export CSV');
      window.location.href = r.download_url;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getList(){
    const data = {
      token: localStorage.getItem('token'),
      name: $("#f_name").val(),
      email: $("#f_email").val(),
      phone: $("#f_phone").val(),
      data_city:$("#f_data_city").val(),
      task_status:$("#f_task_status").val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('student/enquiries',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#searchStudentBtn').html('Search');
      this.users = r.users.data;
      this.total = r.users.total;
      this.total_records = r.users.total;
      this.total_sms_send = r.total_sms_send;

      this.add_p = r.access.add;
      this.edit_p = r.access.edit;
      this.view_p = r.access.view;
      this.delete_p = r.access.delete;
      this.export_p = r.access.export;
      this.import_p = r.access.import;
      this.self_p = r.access.self;
      
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
  updateStatus(userID:string,status:string){
    const data = {};
    this.appService.putData('student/enquiries/status/update/'+userID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.getList();
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  deleteUser(userID:string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        this.updateStatus(userID,'3');
        Swal.fire(
          'Removed!',
          'Partner removed successfully.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Product still in our database.',
        'error'
      )
      }
      })
  }
  searchData(){
    $('#searchStudentBtn').html('Searching..');
    const data = {
      token: localStorage.getItem('token'),
      name: $("#f_name").val(),
      email: $("#f_email").val(),
      phone: $("#f_phone").val(),
      data_city:$("#f_data_city").val(),
      task_status:$("#f_task_status").val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  reset(){
    $("#f_name").val('');
    $("#f_email").val('');
    $("#f_phone").val('');
    $("#f_data_city").val('');
    $("#f_task_status").val('');
    const data = {
      token: localStorage.getItem('token'),
      name: '',
      email: '',
      phone: '',
      data_city:'',
      task_status:'',
      page: 1
    };
    this.getListFromServer(data);
  }
  clearForm(){
    $('#row_id').val(0);
    $('#name').val('');
    $('#email').val('');
    $('#phone').val('');
    $('#city').val('');
    $('#qualification').val('');
  }
  getRowData(id:number){
    this.heading = 'Edit Student Enquiry';
    this.appService.getData('student/enquiries/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.rowData = r.data;
        $('#row_id').val(r.data.id);
        $('#parents_name').val(r.data.parents_name);
        $('#school_name').val(r.data.school_name);
        $('#class').val(r.data.class);
        $('#board').val(r.data.board);
        $('#subject').val(r.data.subject);
        $('#address').val(r.data.address);
        $('#pincode').val(r.data.pincode);
        $('#landmark').val(r.data.landmark);
        $('#city').val(r.data.city);
        $('#state').val(r.data.state);
        $('#phone').val(r.data.phone);
        $('#email').val(r.data.email);
        this.getCitiies();
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  setHeading(){
    this.heading = 'Add Student Enquiry';
    this.clearForm();
  }
  saveData(){
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      id: $('#row_id').val(),
      parents_name: $('#parents_name').val(),
      school_name: $('#school_name').val(),
      class: $('#class').val(),
      board: $('#board').val(),
      subject:$('#subject').val(),
      address: $('#address').val(),
      pincode: $('#pincode').val(),
      landmark: $('#landmark').val(),
      city: $('#city').val(),
      state: $('#state').val(),
      phone: $('#phone').val(),
      email: $('#email').val(),
    };
    this.appService.postData('student/enquiries/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        if($('#row_id').val() == 0){
          this.clearForm();
        }
        this.toastr.success(r.message,"Success");
        this.getList();
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
  uploadData(){
    $('#uploadBtn').html('Processing');
    var file_data = $('#file').prop('files')[0];
    var submitForm  = new FormData();
    submitForm.append('token',localStorage.getItem('token') as string);
    submitForm.append('file',file_data);

    this.appService.postData('student/enquiries/upload',submitForm).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#uploadBtn').html('Upload');
        this.toastr.success(r.message,"Success");
        this.getList();
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  createTaskConfirm(id:number){
    Swal.fire({
      title: 'Are you sure want to create task?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        this.createTask(id);
        Swal.fire(
          'Task Created!',
          'Task created successfully.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Task not created yet.',
        'error'
      )
      }
      })
  }
  createTask(row_id:number){
    const data = {
      token: localStorage.getItem('token'),
      row_id: row_id
    };
    this.appService.postData('student/enquiries/task/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.getList();
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  
  }
  


}

