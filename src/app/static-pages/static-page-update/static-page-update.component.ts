
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-static-page-update',
  templateUrl: './static-page-update.component.html',
  styleUrls: ['./static-page-update.component.css']
})
export class StaticPageUpdateComponent implements OnInit {

  pageID:any;
  user:any;
  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.pageID = this.route.snapshot.params['idRow'];
    this.getUserInfo(this.pageID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getUserInfo(id:number){
    this.appService.getData('inner-page/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['title'].setValue(r.data.title);
        this.form.controls['content'].setValue(r.data.content);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updatePage(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      title: form.title,
      content: form.content
    };
    this.appService.postData('inner-page/update/'+this.pageID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Update');
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
}


