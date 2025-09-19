import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from, noop, of, Subject } from 'rxjs';
import { map, mergeAll, mergeMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-find-tutor',
  templateUrl: './find-tutor.component.html',
  styleUrls: ['./find-tutor.component.css']
})
export class FindTutorComponent implements OnInit {
  SiteUrl = environment.serviceUrl;
  task: any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  heading: any;
  attachments: any;
  taskID: number = 0;
  teacherData:any;

  classes:any;
  boards:any;
  subjects:any;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getClasses();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  setData(data:any){
    this.teacherData = data;
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
  setHeading() {
    this.heading = 'Add Campaign';
    this.clearForm();
  }
  clearForm() {
    $('#row_id').val(0);
    $('#title').val('');
    $('#message').val('');
    $('#message_type').val('');
    $('#type').val('');
  }
  getRowData(id: number) {
    this.heading = 'Edit Campaign';
    this.appService
      .getData('campaign/get/' + id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          if (r.permission) {
            $('#row_id').val(r.data.id);
            $('#title').val(r.data.title);
            $('#message').val(r.data.message);
            $('#message_type').val(r.data.message_type);
            $('#type').val(r.data.type);
          } else {
            this.router.navigateByUrl('/dashboard');
          }
        },
        (error) => {
          this.toastr.error('Server Error', 'Error');
        }
      );
  }
  saveData() {
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      id: $('#row_id').val(),
      title: $('#title').val(),
      message: $('#message').val(),
      message_type: $('#message_type').val(),
      type: $('#type').val(),
    };
    this.appService
      .postData('campaign/create', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        var r: any = res;
        $('#submitBtn').html('Submit');
        if (r.success) {
          if ($('#row_id').val() == 0) {
            this.clearForm();
          }
          this.toastr.success(r.message, 'Success');
          window.location.reload();
        } else {
          this.toastr.error(r.message, 'Error');
        }
      });
  }
  getList() {
    const data = {
      token: localStorage.getItem('token'),
      page: this.p,
      f_titles: $('#f_titles').val(),
    };
    this.getListFromServer(data);
  }
  getListFromServer(form: any) {
    this.appService
      .postData('find/tutor/list', form)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          this.task = r.users;
            $('#searchStudentBtn').html('Search');
        },
        (error) => {
          this.toastr.error('Server Error', 'Error');
        }
      );
  }
  /**
   * Write code on Method
   *
   * @return response()
   */
  pageChangeEvent(event: number) {
    this.p = event;
    this.getList();
  }
  updateStatus(classID: string, status: string) {
    const data = {};
    this.appService
      .putData('campaign/status/update/' + classID + '/' + status, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          this.getList();
        },
        (error) => {
          this.toastr.error('Server Error', 'Error');
        }
      );
  }
  resetCampaign(campID:number){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.appService
      .getData('campaign/reset/' + campID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.getList();
        },
        (error) => {
          this.toastr.error('Server Error', 'Error');
        }
      );
        Swal.fire('Success!', 'Campaign reset successfully.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Class still in our database.', 'error');
      }
    });
  }
  deleteUser(classID: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.updateStatus(classID, '3');
        Swal.fire('Removed!', 'Task removed successfully.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Class still in our database.', 'error');
      }
    });
  }
  searchData() {
    if($('#f_latutude').val() == '' || $('#f_longitude').val() == '' || $('#f_range').val() == ''){
      this.toastr.error('Please enter latitude, longitude and range', 'Error');
    }else{
      $('#searchStudentBtn').html('Searching..');
      const data = {
        token: localStorage.getItem('token'),
        f_name: $('#f_name').val(),
        f_class: $('#f_class').val(),
        f_subjects: $('#f_subjects').val(),
        f_board: $('#f_board').val(),
        f_latutude: $('#f_latutude').val(),
        f_longitude: $('#f_longitude').val(),
        f_range: $('#f_range').val(),
        f_gender: $('#f_gender').val(),
        f_location:$('#f_location').val(),
        page: 1,
      };
      this.getListFromServer(data);
    }
    
  }
  
}

