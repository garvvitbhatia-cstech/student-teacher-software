import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnDestroy {

  franchises:any;
  managers:any;
  telecaller_pivotes:any;
  interviewer_pivotes:any;
  activity_count:number = 0;
  vc_count:number = 0;
  total_appointments:number = 0;
  total_telecaller:number = 0;
  today_total_telecaller:number = 0;
  today_total_appointments:number = 0;
  month_total_appointments:number = 0;
  month_total_telecaller:number=0;
  total_doc_verify:number = 0;
  total_doc_unverify:number = 0;
  today_total_doc_verify:number = 0;
  month_total_doc_verify:number = 0;
  today_total_doc_unverify:number = 0;
  month_total_doc_unverify:number = 0;
  total_docs:number = 0;
  today_total_docs:number=0;
  month_total_docs:number = 0;
  pending_for_docs_interview:number = 0;
  pending_for_docs_appointment:number = 0;
  done_interview:number = 0;
  done_appointment:number = 0;
  total_interviews:number=0;
  pending_appointment:number=0;

  old_interview_doc_done:number = 0;
  crm_doc_done_interview:number = 0;
  old_interview_doc_pending:number = 0;
  grand_total_interviews:number=0;
  totalDoneInterview:number=0;
  totalPendingInterview:number=0;
  totalTodayInterviewCount:number=0;
  totalTodayTelecallingCount:number=0;

  firstDocDone:number=0;

  interviewer_all_pivotes:any;
  telecaller_all_pivotes:any;

  destroy$ = new Subject();
  login_user_type = localStorage.getItem('login_user_type');

  constructor(
    private router: Router,
    private appService: AppService,
    ) {

     }

  ngOnInit(): void {
    this.getDashboardManagers();
    this.getTaskReminderCount();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  
  getDashboardManagers(){
      this.appService.getData('dashboard/manager/list').pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        this.managers = r.managers;
      },error =>{
      });
  }

  getTaskReminderCount(){
    const data = {
      token: localStorage.getItem('token')
    };
    this.appService.postData('get/reminder/count',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.activity_count = r.activity_count;
      this.vc_count = r.vc_count;
     // this.managers = r.managers;
    },error =>{
    });
}



  
}
