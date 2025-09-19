import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-doc-followup-data',
  templateUrl: './doc-followup-data.component.html',
  styleUrls: ['./doc-followup-data.component.css']
})
export class DocFollowupDataComponent implements OnInit {

  faqs:any;
  franchises:any;
  interviwers:any;
  p: number = 1;
  total: number = 0;
  total_record:number = 0;
  need_call: number = 0;
  reg_done: number = 0;
  login_user_type = localStorage.getItem('login_user_type');
  add_p:any;
  edit_p:any;
  view_p:any;
  delete_p:any;
  export_p:any;
  import_p:any;
  self_p:any;
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
    this.getAllFranchise();
    this.getAllInterviewer();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  sendEmail(id:number){
    $('#send_btn_'+id).html('Processing...');
    var form = {token: localStorage.getItem('token'),id:id};
    this.appService.postData('send-doc-followup-email',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      this.toastr.success("Email Send Successfully","Success");
      $('#send_btn_'+id).html('Send Email');
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getAllInterviewer(){
    var form = {token: localStorage.getItem('token')};
    this.appService.postData('interviewer/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.interviwers = r.interviwers;
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
    this.appService.postData('doc/followup/get/csv',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
      f_data_city:$('#f_data_city').val(),
      f_task_status:$('#f_task_status').val(),
      f_interviewer_name:$('#f_interviewer_name').val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('doc/followup/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.faqs = r.users.data;
        this.total = r.users.total;
        this.total_record = r.total_record;
        this.need_call = r.needCallCount;
        this.reg_done = this.total_record-this.need_call;

        this.add_p = r.access.add;
        this.edit_p = r.access.edit;
        this.view_p = r.access.view;
        this.delete_p = r.access.delete;
        this.export_p = r.access.export;
        this.import_p = r.access.import;
        this.self_p = r.access.self;

        $('#searchStudentBtn').html('Search');
      }else{
        this.router.navigateByUrl('/dashboard');
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
  createTask(purchase_user_data_id:number){
    const data = {
      token: localStorage.getItem('token'),
      purchase_user_data_id: purchase_user_data_id,
      type:'Document'
    };
    this.appService.postData('task/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.getList();
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  
  }
  updateStatus(faqID:string,status:string){
    const data = {};
    this.appService.putData('telecaller/status/update/'+faqID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        if(status == '3'){
          Swal.fire(
            'Removed!',
            'Record removed successfully.',
            'success'
          )
        }
        this.getList();
      }else{
        Swal.fire(
          'Error',
          r.message,
          'error'
        )
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  deleteUser(faqID:string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        this.updateStatus(faqID,'3');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Record still in our database.',
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
      f_data_city:$('#f_data_city').val(),
      f_task_status:$('#f_task_status').val(),
      f_interviewer_name:$('#f_interviewer_name').val(),
      need_call:'',
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
    $("#f_interviewer_name").val('');
    const data = {
      token: localStorage.getItem('token'),
      name: '',
      email: '',
      phone: '',
      need_call:'',
      f_data_city:'',
      f_task_status:'',
      f_interviewer_name:'',
      page: 1
    };
    this.getListFromServer(data);
  }

}


