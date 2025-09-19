import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from, noop, of, Subject } from 'rxjs';
import { map, mergeAll, mergeMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-subject-create',
  templateUrl: './subject-create.component.html',
  styleUrls: ['./subject-create.component.css'],
})
export class SubjectCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  destroy$ = new Subject();
  classes: any;
  stateList:any;
  boards:any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    public fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      class: ['', Validators.required],
      state_id: ['', Validators.required],
      board_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkPermission();
    this.getClasses();
    this.getStates();
    this.getBoards();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  checkPermission() {
    this.appService
      .getData('check/permission/1')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        var r: any = res;
        if (r.permission) {
        } else {
          this.router.navigateByUrl('/dashboard');
        }
      });
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
  getClasses() {
    this.appService
      .getData('get/classes/list/add/1')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          if (r.success) {
            this.classes = r.users;
          } else {
            this.toastr.error('Carrier not loading', 'Error');
          }
        },
        (error) => {
          this.toastr.error('Server Error', 'Error');
        }
      );
  }
  createSubject(form: any) {
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      title: form.title,
      class:form.class,
      state_id:form.state_id,
      board_id:form.board_id
    };
    this.appService
      .postData('subject/create', data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        var r: any = res;
        $('#submitBtn').html('Submit');
        if (r.success) {
          this.toastr.success(r.message, 'Success');
          this.router.navigateByUrl('subjects');
        } else {
          this.toastr.error(r.message, 'Error');
        }
      });
  }
}
