import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  invoices:any;
  userType:any;
  loginUser:any;
  destroy$ = new Subject();

  constructor(
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    ) {

     }

  ngOnInit(): void {
    this.getLoginUserInfo();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getLoginUserInfo(){
    this.appService.getData('profile/details/get').pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        this.loginUser = r.data;
      },error =>{
      });
  }
  showNotification(){
    $('.notification_box').toggle();
  }
  logout(){
    localStorage.removeItem("token");
    this.router.navigateByUrl('');
  }

}
