import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-student-packages',
  templateUrl: './student-packages.component.html',
  styleUrls: ['./student-packages.component.css']
})
export class StudentPackagesComponent implements OnInit,OnDestroy {

  packages:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  classes:any;
  boards:any;
  subjects:any;
  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder,
    ) {

     }

  ngOnInit(): void {
    this.getList();
    this.getClasses();
  }
  ngOnDestroy() {
    this.destroy$.complete();
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
  cloneAction(id:number){
    Swal.fire({
      title: 'Are you sure want to clone it?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        this.clonePackage(id);
        Swal.fire(
          'Removed!',
          'Student package removed successfully.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Student package still in our database.',
        'error'
      )
      }
      })
  }
  clonePackage(id:number){
    var form = {
      token: localStorage.getItem('token'),
      id:id
    };
    this.appService.postData('student-packages/clone',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.getList();
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  exportCSV(){
    $('#exportBtn').html('Processing...');
    const data = {
      token: localStorage.getItem('token')
    };
    this.appService.postData('student-package/get/csv',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
      page: this.p,
      title: $("#f_title").val(),
      class_id: $("#f_class").val(),
      subject: $("#f_subjects").val(),
      board: $("#f_board").val(),
      duration_days: $("#f_duration_days").val(),
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('student-packages/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.packages = r.users.data;
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
    this.appService.putData('student-package/status/update/'+classID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
          'Student package removed successfully.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Student package still in our database.',
        'error'
      )
      }
      })
  }
  searchData(){
    $('#searchStudentBtn').html('Searching..');
    const data = {
      token: localStorage.getItem('token'),
      title: $("#f_title").val(),
      class_id: $("#f_class").val(),
      subject: $("#f_subjects").val(),
      board: $("#f_board").val(),
      duration_days: $("#f_duration_days").val(),
      page: 1
    };
    this.getListFromServer(data);
  }
  reset(){
    $("#f_title").val('');
    $("#f_class").val('');
    $("#f_subjects").val('');
    $("#f_board").val('');
    $("#f_duration_days").val('');
    const data = {
      token: localStorage.getItem('token'),
      title: '',
      class_id: '',
      subject: '',
      board: '',
      duration_days: '',
      page: 1
    };
    this.getListFromServer(data);
  }

}

