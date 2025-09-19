import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-developer-task',
  templateUrl: './developer-task.component.html',
  styleUrls: ['./developer-task.component.css']
})
export class DeveloperTaskComponent implements OnInit {

  task:any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  heading:any;
  attachments:any;
  taskID: number = 0;
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
  setHeading(){
    this.heading = 'Add Developer Task';
    this.clearForm();
  }
  getAttachments(developer_task_id:number){
    $('#p_id').val(developer_task_id);
    const data = {
      token: localStorage.getItem('token'),
      developer_task_id: developer_task_id
    };
    this.appService.postData('dev-attachments/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.attachments = r.images;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  uploadInvoiceDoc(){
   
    var fileLenght = ($('#photo_image').prop('files').length)-1;
    if(fileLenght <= 0){
      this.toastr.error("Please choose file","Error");
    }
    for(var i=0; i<= fileLenght; i++){
      const taskID:any = $('#p_id').val();
      $('#addUserBtn2').html('Processing...');
      //$('#addUserBtn2').attr('disabled',true);
      var form  = new FormData();
      form.append('token',localStorage.getItem('token') as string);
      form.append('file',$('#photo_image').prop('files')[i]);
      form.append('booking_id',taskID);
      this.appService.postData('upload/attachments',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        this.toastr.success("File uploaded successfully","Success");
        this.getAttachments(taskID);
        $('#addUserBtn2').html('Upload');
       // $('#addUserBtn2').attr('disabled',false);
        $("#photo_image").val('');
      });
    }
    
    
  }
  deleteImage(id:number){
    var status = 3;
    var bookingId:any = $('#p_id').val();
    const data = {};
    this.appService.putData('dev-attachments/status/update/'+id+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.getAttachments(bookingId);
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  clearForm(){
    $('#row_id').val(0);
    $('#title').val('');
    $('#description').val('');
  }
  getRowData(id:number){
    this.heading = 'Edit Developer Task';
    this.appService.getData('dev-task/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        $('#row_id').val(r.data.id);
        $('#title').val(r.data.title);
        $('#description').val(r.data.description);
        $('#issue_for').val(r.data.issue_for);
        $('#com_date').val(r.data.com_date);
      }else{
        this.router.navigateByUrl('/dashboard');
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
      title: $('#title').val(),
      description: $('#description').val(),
      issue_for: $('#issue_for').val(),
      com_date: $('#com_date').val()
    };
    this.appService.postData('dev-task/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
      page: this.p,
      f_titles: $("#f_titles").val(),
      f_issue_for: $("#f_issue_for").val(),
      f_status: $("#f_status").val(),
      
    };
    this.getListFromServer(data);
  }
  getListFromServer(form:any){
    this.appService.postData('dev-task/list',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.task = r.users.data;
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
  updateOrder(rowID:number,prev_val:number){
    let current_val = $('#ordering_'+rowID).val();
    const data = {};
    this.appService.putData('dev-task/ordering/update/'+rowID+'/'+current_val+'/'+prev_val,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.getList();
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateStatus(classID:string,status:string){
    const data = {};
    this.appService.putData('dev-task/status/update/'+classID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
          'Task removed successfully.',
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
      f_titles: $("#f_titles").val(),
      f_issue_for: $("#f_issue_for").val(),
      f_status: $("#f_status").val(),
      page: 1
    };
    this.getListFromServer(data);
  }
  reset(){
    $("#f_titles").val('');
    $("#f_issue_for").val('');
    $("#f_status").val('');
    const data = {
      token: localStorage.getItem('token'),
      f_titles: '',
      f_issue_for:'',
      f_status:'',
      page: 1
    };
    this.getListFromServer(data);
  }

}