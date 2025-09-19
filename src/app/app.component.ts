import { Component } from '@angular/core';
import * as $ from "jquery";
import { AppService } from './services/app.service';
import { Router } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin';
  constructor(
    private appService: AppService,
    private router: Router,
    private location: Location
    ) {
        var form = new FormData();
        form.append("token",localStorage.getItem('token') as string);
        this.appService.login('verify',form).subscribe(res=>{
          var r:any=res;
          if(location.path() == ''){
            this.router.navigateByUrl('dashboard');
          }
        },error =>{
          this.router.navigateByUrl('');
        });
     }
  
}
