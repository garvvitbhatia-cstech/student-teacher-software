import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { Location } from "@angular/common";
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit,OnDestroy {

  loginUser:any;
  managers:any;
  pageName:any;
  destroy$ = new Subject();
  login_user_name = localStorage.getItem('login_user_name');
  login_user_email = localStorage.getItem('login_user_email');
  login_user_phone = localStorage.getItem('login_user_phone');
  login_user_type = localStorage.getItem('login_user_type');

  constructor(
    private router: Router,
    private appService: AppService,
    private location: Location
    ) {
      this.pageName = location.path();
     }

  ngOnInit(): void {
    this.getDashboardManagers();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  logout(){
    localStorage.removeItem("token");
    this.router.navigateByUrl('');
  }
  
  getDashboardManagers(){
      this.appService.getData('dashboard/manager/list').pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        this.managers = r.managers;
      },error =>{
      });
  }

}
