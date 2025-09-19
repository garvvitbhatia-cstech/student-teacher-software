import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-board-update',
  templateUrl: './board-update.component.html',
  styleUrls: ['./board-update.component.css']
})
export class BoardUpdateComponent implements OnInit,OnDestroy {

  boardID:any;
  user:any;
  form: FormGroup;
  destroy$ = new Subject();
  stateList:any;
  cityList:any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.boardID = this.route.snapshot.params['idBoard'];
    this.getUserInfo(this.boardID);
    this.getStates();
    this.getCitiies();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getUserInfo(id:number){
    this.appService.getData('board/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['title'].setValue(r.data.title);
        this.form.controls['state_id'].setValue(r.data.state_id);
        this.form.controls['city_id'].setValue(r.data.city_id);
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
      state_id: form.state_id,
      city_id: form.city_id
    };
    this.appService.putData('board/update/'+this.boardID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Update');
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
  getCitiies(){
    var value = $('#state_id').val();    
    const data = {
      value:value,
      id: $('#row_id').val(),
      token: localStorage.getItem('token'),
    };
    this.appService.postData('get/cities/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.cityList = r.users;
      }else{
        this.toastr.error("City not loading","Error");
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
}
