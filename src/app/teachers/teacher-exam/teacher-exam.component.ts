
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-teacher-exam',
  templateUrl: './teacher-exam.component.html',
  styleUrls: ['./teacher-exam.component.css']
})
export class TeacherExamComponent implements OnInit {

  userID:any;
  questionAnswers:any;
  lastStatus:any;
  destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {

  }

  ngOnInit(): void {
    this.userID = this.route.snapshot.params['idTeacher'];
    this.getUserInfo(this.userID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }

  getUserInfo(id:number){
    this.appService.getData('teacher/exam/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.questionAnswers = r.data
      this.lastStatus = r.lastStatus
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateStatus(){
    $('#submitBtn').html('Processing..');
    var formData  = new FormData();
    formData.append('token',localStorage.getItem('token') as string);
    formData.append('exam_status',$('#exam_status').val() as string);
    this.appService.postData('teacher/exam/update/'+this.userID,formData).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        $('#submitBtn').html('Save Result');
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }

}
