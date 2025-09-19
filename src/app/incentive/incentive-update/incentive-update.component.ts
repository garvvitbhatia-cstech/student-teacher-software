import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-incentive-update',
  templateUrl: './incentive-update.component.html',
  styleUrls: ['./incentive-update.component.css']
})
export class IncentiveUpdateComponent implements OnInit,OnDestroy {

  boardID:any;
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
      amount: ['', Validators.required],

    });
  }
  ngOnInit(): void {
    this.boardID = this.route.snapshot.params['idIncentive'];
    this.getUserInfo(this.boardID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getUserInfo(id:number){
    this.appService.getData('incentive/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['title'].setValue(r.data.title);
        this.form.controls['amount'].setValue(r.data.amount);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateBoard(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      title: form.title,
      amount: form.amount
    };
    this.appService.putData('incentive/update/'+this.boardID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
