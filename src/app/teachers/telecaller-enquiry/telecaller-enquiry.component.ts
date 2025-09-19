import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-telecaller-enquiry',
  templateUrl: './telecaller-enquiry.component.html',
  styleUrls: ['./telecaller-enquiry.component.css']
})
export class TelecallerEnquiryComponent implements OnInit {

  faqs:any;
  franchises:any;
  p: number = 1;
  total: number = 0;
  total_record:number = 0;
  need_call: number = 0;
  reg_done: number = 0;
  total_email_send: number = 0;
  destroy$ = new Subject();

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
  exportCSV(){
    $('#exportBtn').html('Processing...');
    const data = {
      token: localStorage.getItem('token')
    };
    this.appService.postData('telecaller/get/csv',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
      need_call:$("#need_call").val(),
      f_data_city:$('#f_data_city').val(),
      read_status:$('#read_status').val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('telecaller/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.faqs = r.users.data;
        this.total = r.users.total;
        this.total_record = r.total_record;
        this.need_call = r.needCallCount;
        this.reg_done = this.total_record-this.need_call;
        this.total_email_send = r.total_email_send;

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
      need_call:$("#need_call").val(),
      f_data_city:$('#f_data_city').val(),
      read_status:$('#read_status').val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  reset(){
    $("#f_name").val('');
    $("#f_email").val('')
    $("#f_phone").val('');
    $("#need_call").val('');
    $('#f_data_city').val('');
    $('#read_status').val('');
    const data = {
      token: localStorage.getItem('token'),
      name: '',
      email: '',
      phone: '',
      need_call:'',
      f_data_city:'',
      read_status:'',
      page: 1
    };
    this.getListFromServer(data);
  }

}

