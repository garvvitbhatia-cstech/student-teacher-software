import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.css']
})
export class ContactSupportComponent implements OnInit,OnDestroy {

  boards:any;
  p: number = 1;
  total: number = 0;
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
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getList(){
    const data = {
      token: localStorage.getItem('token'),
      page: this.p
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('contact-support/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
    this.appService.putData('contact-support/status/update/'+classID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
      f_token: $("#f_token").val(),
      f_name: $("#f_name").val(),
      f_email: $("#f_email").val(),
      f_phone: $("#f_phone").val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  reset(){
    const data = {
      token: localStorage.getItem('token'),
      f_token: '',
      f_name: '',
      f_email: '',
      f_phone: '',
      page: this.p
    };
    this.getListFromServer(data);
  }

}
