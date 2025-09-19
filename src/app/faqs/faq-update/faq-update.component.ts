
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-faq-update',
  templateUrl: './faq-update.component.html',
  styleUrls: ['./faq-update.component.css']
})
export class FaqUpdateComponent implements OnInit {

  faqID:any;
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
      type: ['', Validators.required],
      category: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.faqID = this.route.snapshot.params['idRow'];
    this.getUserInfo(this.faqID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getUserInfo(id:number){
    this.appService.getData('faq/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['type'].setValue(r.data.type);
        this.form.controls['category'].setValue(r.data.category);
        this.form.controls['question'].setValue(r.data.question);
        this.form.controls['answer'].setValue(r.data.answer);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateFaq(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      type: form.type,
      category: form.category,
      question: form.question,
      answer: form.answer
    };
    this.appService.postData('faq/update/'+this.faqID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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

