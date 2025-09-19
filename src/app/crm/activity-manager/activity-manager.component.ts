
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
  selector: 'app-activity-manager',
  templateUrl: './activity-manager.component.html',
  styleUrls: ['./activity-manager.component.css']
})
export class ActivityManagerComponent implements OnInit {

  SiteUrl = environment.serviceUrl;

  users:any;
  franchises:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  heading:any;
  rowData:any;
  activity_id:any;
  interviewers:any;
  activity_option = false;
  login_user_type = localStorage.getItem('login_user_type');
  add_p:any;
  edit_p:any;
  view_p:any;
  delete_p:any;
  export_p:any;
  import_p:any;
  self_p:any;

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
  }
  ngOnDestroy() {
    this.destroy$.complete();
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
  getInterViewerList(task_id:number,activity_id:number){
    $('#activity_id').val(activity_id);
    const data = {
      token: localStorage.getItem('token'),
    };
    this.appService.postData('interviwer/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.interviewers = r.users;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getList(){
    const data = {
      token: localStorage.getItem('token'),
      page: this.p,
      type:'All',
      name: $("#f_name").val(),
      email: $("#f_email").val(),
      phone: $("#f_phone").val(),
      f_data_city:$('#f_data_city').val(),
      task_type:$("#f_task_type").val(),
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('activity/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.users = r.users.data;
        this.total = r.users.total;

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
    this.searchData();
  }
  searchData(){
    $('#searchStudentBtn').html('Searching..');
    const data = {
      token: localStorage.getItem('token'),
      name: $("#f_name").val(),
      email: $("#f_email").val(),
      phone: $("#f_phone").val(),
      f_data_city:$('#f_data_city').val(),
      type:'All',
      task_type:$("#f_task_type").val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  reset(){
    $("#f_name").val('');
    $("#f_email").val('');
    $("#f_phone").val('');
    $("#f_task_type").val('');
    const data = {
      token: localStorage.getItem('token'),
      name: '',
      email: '',
      phone: '',
      type:'All',
      task_type:'',
      f_data_city:'',
      page: 1
    };
    this.getListFromServer(data);
  }
  exportCSV(){
    $('#exportBtn').html('Processing...');
    const data = {
      token: localStorage.getItem('token')
    };
    this.appService.postData('activity/get/csv',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#exportBtn').html('Export CSV');
      window.location.href = r.download_url;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getRowData(id:number,activity_id:number,type:string){
    this.activity_option = false;
    this.activity_id = activity_id;
    this.appService.getData('task/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.rowData = r.data;
        $('#row_id').val(r.data.id);
        $('#name').val(r.data.name);
        $('#type').val(type);
        $('#phone_number').html(r.data.phone);
        $('#phone_number').attr('href','tel:'+r.data.phone);
        if(r.data.type == 'Purchased'){
          this.activity_option = true;
        }
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  AssignInterviewer(){
    $('#submitBtn2').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      activity_id: $('#activity_id').val(),
      user_id: $('#interviewer_id').val(),
    };
    this.appService.postData('assign/interview',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn2').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.getList();
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
  createActivity(){
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      id: $('#row_id').val(),
      type: $('#type').val(),
      activity_date: $('#activity_date').val(),
      description: $('#description').val(),
      description_type: $('#description_type').val(),
      status: $('#status').val(),
      activity_id:this.activity_id,
      assign_user_id:null
    };
    this.appService.postData('task/activity/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.getList();
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
}



