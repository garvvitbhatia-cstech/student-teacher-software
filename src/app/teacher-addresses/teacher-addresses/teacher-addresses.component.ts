import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from, noop, of, Subject } from 'rxjs';
import { map, mergeAll, mergeMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-teacher-addresses',
  templateUrl: './teacher-addresses.component.html',
  styleUrls: ['./teacher-addresses.component.css'],
})
export class TeacherAddressesComponent implements OnInit, OnDestroy {
  SiteUrl = environment.serviceUrl;
  users: any;
  teacherData: any;
  p: number = 1;
  total: number = 0;
  destroy$ = new Subject();
  teacherID:any;
  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.teacherID = this.route.snapshot.params['idTeacher'];
    this.getList();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getList() {
    const data = {
      token: localStorage.getItem('token'),
      page: this.p,
    };
    this.getListFromServer(data);
  }
  getListFromServer(form: any) {
    this.appService
      .postData('teacher-addresses/list/'+this.teacherID, form)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          this.teacherData = r.userDetails;
          this.users = r.users.data;
          this.total = r.users.total;
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
  updateStatus(userID: string, status: string) {
    const data = {};
    this.appService
      .putData('teacher-address/status/update/' + userID + '/' + status, data)
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
  deleteUser(userID: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.updateStatus(userID, '3');
        Swal.fire('Removed!', 'Address removed successfully.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Address still in our database.', 'error');
      }
    });
  }
  searchData() {
    const data = {
      token: localStorage.getItem('token'),
      teacher_address: $('#teacher_address').val(),
      page: this.p,
    };
    this.getListFromServer(data);
  }
  reset() {
    const data = {
      token: localStorage.getItem('token'),
      teacher_address: '',
      page: this.p,
    };
    this.getListFromServer(data);
  }
}
