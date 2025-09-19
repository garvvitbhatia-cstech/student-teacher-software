import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  appintments:any;
  franchises:any;
  p: number = 1;
  total: number = 0;
  need_call: number = 0;
  total_record:number = 0;
  reg_done: number = 0;
  
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
    this.appService.postData('appointments/get/csv',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
      title: $("#title").val(),
      need_call:$("#need_call").val(),
      f_data_city:$('#f_data_city').val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('appointments/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.appintments = r.users.data;
        this.total = r.users.total;
        this.total_record = r.total_record;
        this.need_call = r.needCallCount;
        this.reg_done = this.total_record-this.need_call;
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
    this.appService.putData('appointments/status/update/'+faqID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
      title: $("#title").val(),
      need_call:$("#need_call").val(),
      f_data_city:$('#f_data_city').val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  reset(){
    $("#title").val('');
    $("#need_call").val('');
    $('#f_data_city').val('');
    const data = {
      token: localStorage.getItem('token'),
      title: '',
      need_call:'',
      f_data_city:'',
      page: 1
    };
    this.getListFromServer(data);
  }

}