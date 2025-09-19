import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-franchise',
  templateUrl: './franchise.component.html',
  styleUrls: ['./franchise.component.css']
})
export class FranchiseComponent implements OnInit,OnDestroy {

  boards:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  heading:any;
  stateList:any;
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
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  setHeading(){
    this.heading = 'Add Franchise City';
    this.clearForm();
  }
  clearForm(){
    $('#row_id').val(0);
    $('#city_name').val('');
    $('#state_id').val('');
    $('#email').val('');
    $('#phone').val('');
    $('#address').val('');
  }
  getRowData(id:number){
    this.heading = 'Edit Franchise City';
    this.appService.getData('franchise/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        $('#row_id').val(r.data.id);
        $('#state_id').val(r.data.state_id);
        $('#city_name').val(r.data.title);
        $('#email').val(r.data.email);
        $('#phone').val(r.data.phone);
        $('#address').val(r.data.address);
      }else{
        this.router.navigateByUrl('/dashboard');
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
        this.toastr.error("Carrier not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  saveData(){
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      id: $('#row_id').val(),
      state_id: $('#state_id').val(),
      title: $('#city_name').val(),
      email: $('#email').val(),
      phone: $('#phone').val(),
      address: $('#address').val()
    };
    this.appService.postData('franchise/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
  getList(){
    const data = {
      token: localStorage.getItem('token'),
      page: this.p
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('franchise/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.boards = r.users.data;
        this.total = r.users.total;
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
  updateStatus(classID:string,status:string){
    const data = {};
    this.appService.putData('franchise/status/update/'+classID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
      f_state_id: $("#f_state_id").val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  reset(){
    const data = {
      token: localStorage.getItem('token'),
      title: '',
      page: this.p,
      f_state_id:''
    };
    this.getListFromServer(data);
  }

}

