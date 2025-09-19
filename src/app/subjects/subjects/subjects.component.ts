import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit,OnDestroy {

  classes:any;
  subjects:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  boards:any;
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
    this.getClasses();
    this.getBoards();
    this.getStates();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getBoards(){
    this.appService.getData('get/boards/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.boards = r.users;
      }else{
        this.toastr.error("Board not loading","Error");
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
  setOrder(id:number){
    const data = {
      token: localStorage.getItem('token'),
      id: id,
      order:$('#order_'+id).val()
    };
    this.appService.postData('set/subject/order',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.getList();
      }else{
        this.toastr.error(r.message,"Error");
        this.getList();
      }
      
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getClasses(){
    this.appService.getData('get/classes/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.classes = r.users;
      }
    },error=>{

    });
  }
  getList(){
    const data = {
      token: localStorage.getItem('token'),
      title: $("#title").val(),
      f_class: $("#f_class").val(),
      f_board: $("#f_board").val(),
      f_state: $("#f_state").val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('subjects/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.subjects = r.users.data;
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
  updateStatus(subjectID:string,status:string){
    const data = {};
    this.appService.putData('subject/status/update/'+subjectID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        if(status == '3'){
          Swal.fire(
            'Removed!',
            'Teacher removed successfully.',
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
  deleteUser(subjectID:string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        this.updateStatus(subjectID,'3');
        Swal.fire(
          'Removed!',
          'Customer removed successfully.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Subject still in our database.',
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
      f_class: $("#f_class").val(),
      f_board: $("#f_board").val(),
      f_state: $("#f_state").val(),
      page: this.p
    };
    this.getListFromServer(data);
  }
  reset(){
    $("#title").val('');
    $("#f_class").val('');
    $("#f_board").val('');
    $("#f_state").val('');
    const data = {
      token: localStorage.getItem('token'),
      title: '',
      f_class: '',
      f_board: '',
      f_state: '',
      page: 1
    };
    this.getListFromServer(data);
  }

}
