import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from, noop, of, Subject } from 'rxjs';
import { map, mergeAll, mergeMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css'],
})
export class CampaignsComponent implements OnInit {
  task: any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  heading: any;
  attachments: any;
  taskID: number = 0;
  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getList();
  }
  ngOnDestroy() {
    this.destroy$.complete();
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
      .postData('campaign/list', form)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          if (r.permission) {
            this.task = r.users.data;
            this.total = r.users.total;
            $('#searchStudentBtn').html('Search');
          } else {
            this.router.navigateByUrl('/dashboard');
          }
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
    $('#searchStudentBtn').html('Searching..');
    const data = {
      token: localStorage.getItem('token'),
      f_titles: $('#f_titles').val(),
      page: 1,
    };
    this.getListFromServer(data);
  }
  reset() {
    $('#f_titles').val('');
    $('#f_issue_for').val('');
    const data = {
      token: localStorage.getItem('token'),
      f_titles: '',
      page: 1,
    };
    this.getListFromServer(data);
  }
}
