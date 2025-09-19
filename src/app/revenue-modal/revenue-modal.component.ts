import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-revenue-modal',
  templateUrl: './revenue-modal.component.html',
  styleUrls: ['./revenue-modal.component.css']
})
export class RevenueModalComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();

  totalAmount:number = 0;
  totalTodaysAmount:number = 0;
  totalMonthAmount:number = 0;
  totalTutorAmount:number = 0;
  totalTutorTodaysAmount:number = 0;
  totalTutorMonthAmount:number = 0;
  totalNetAmount:number = 0;
  totalNetTodaysAmount:number = 0;
  totalNetMonthAmount:number = 0;
  totalHours:number = 0;
  TodaysHours:number = 0;
  MonthHours:number = 0;

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder,
    ) {

     }

  ngOnInit(): void {
    this.getRevenueReport();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getRevenueReport(){
    this.appService.getData('dashboard/revenue').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.totalAmount = r.totalAmount;
      this.totalTodaysAmount = r.totalTodaysAmount;
      this.totalMonthAmount = r.totalMonthAmount;
      this.totalTutorAmount = r.totalTutorAmount;
      this.totalTutorTodaysAmount = r.totalTutorTodaysAmount;
      this.totalTutorMonthAmount = r.totalTutorMonthAmount;
      this.totalNetAmount = r.totalNetAmount;
      this.totalNetTodaysAmount = r.totalNetTodaysAmount;
      this.totalNetMonthAmount = r.totalNetMonthAmount;
      this.totalHours = r.totalHours;
      this.TodaysHours = r.TodaysHours;
      this.MonthHours = r.MonthHours;
    },error =>{
    });
  }

}
