
import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-progress-report',
  templateUrl: './progress-report.component.html',
  styleUrls: ['./progress-report.component.css']
})
export class ProgressReportComponent implements OnInit,OnDestroy {

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
    this.getAllFranchise();
    this.getReport();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getReport(){
    var data = {
      token: localStorage.getItem('token'),
      city:$('#f_data_city').val()
    };
    this.appService.postData('report/data',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;

      this.telecaller_pivotes = r.tele_pivote;
      this.interviewer_pivotes = r.int_pivote;
      this.interviewer_all_pivotes = r.int_all_pivote;
      this.telecaller_all_pivotes =  r.tele_all_pivote;

      this.total_appointments = r.total_appointments;
      this.total_telecaller = r.total_telecaller;
      this.today_total_telecaller = r.today_total_telecaller;
      this.today_total_appointments = r.today_total_appointments;
      this.month_total_appointments = r.month_total_appointments;
      this.month_total_telecaller = r.month_total_telecaller;
      this.total_doc_verify = r.total_doc_verify;
      this.total_doc_unverify = r.total_doc_unverify;
      this.today_total_doc_verify = r.today_total_doc_verify;
      this.month_total_doc_verify = r.month_total_doc_verify;
      this.today_total_doc_unverify = r.today_total_doc_unverify;
      this.month_total_doc_unverify = r.month_total_doc_unverify;
      this.total_docs = r.total_docs;
      this.today_total_docs = r.today_total_docs;
      this.month_total_docs = r.month_total_docs;
      this.pending_for_docs_interview = r.pending_for_docs_interview;
      this.pending_for_docs_appointment = r.pending_for_docs_appointment;
      this.done_interview = r.done_interview;
      this.done_appointment = r.done_appointment;
      this.total_interviews = r.total_interviews;
      this.pending_appointment = r.pending_appointment;

      this.old_interview_doc_done = this.total_docs-(this.total_interviews-this.pending_for_docs_interview);
      this.crm_doc_done_interview = this.total_interviews-this.pending_for_docs_interview;
      this.old_interview_doc_pending = 404-this.old_interview_doc_done;
      this.grand_total_interviews = this.total_telecaller+404;
      this.totalDoneInterview = this.crm_doc_done_interview+this.old_interview_doc_done;
      this.totalPendingInterview = this.pending_for_docs_interview+this.old_interview_doc_pending;

      this.totalTodayInterviewCount = r.totalTodayInterviewCount;
      this.totalTodayTelecallingCount = r.totalTodayTelecallingCount;

      this.firstDocDone = r.firstDocDone;
      
    },error =>{
    });
  }
  getAllFranchise(){
    var form = {token: localStorage.getItem('token')};
    this.appService.postData('franchise/list/all',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.franchises = r.users;
    },error=>{
      //this.toastr.error("Server Error","Error");
    });
  }
  





  
}
