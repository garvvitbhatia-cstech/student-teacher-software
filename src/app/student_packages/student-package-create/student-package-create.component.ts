import { Component, OnInit,OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-student-package-create',
  templateUrl: './student-package-create.component.html',
  styleUrls: ['./student-package-create.component.css']
})
export class StudentPackageCreateComponent implements OnInit,OnDestroy {

  form: FormGroup;
  destroy$ = new Subject();
  classes: any;
  boards:any;
  subjects:any;
  childrens:any = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private appService: AppService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      category: ['', Validators.required],
      type: ['', Validators.required],
      title: ['', Validators.required],
      heading: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      class_id: ['', Validators.required],
      duration_days: ['', Validators.required],
      tution_hour: ['', Validators.required],
      subject: ['', Validators.required],
      board: ['', Validators.required],
      mrp: ['', Validators.required],
      discount: ['', Validators.required],
      discount_type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkPermission();
    this.getClasses();
    this.getBoards();
    this.getSubjects();

  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  addMore(){
    this.childrens.push({
      id:0,
      duration:'',
      hours:'',
      price:'',
      title:'',
      mrp:'',
      discount:'',
      discount_type:''
    });
  }
  removeRow(counter:number){
    this.childrens.splice(counter,1);
  }
  setDuration(counter:number){
    this.childrens[counter].duration = $('#duration_days_'+counter).val();
  }
  setHour(counter:number){
    this.childrens[counter].hours = $('#tution_hour_'+counter).val();
  }
  setPrice(counter:number){
    this.childrens[counter].price = $('#price_'+counter).val();
  }
  setTitle(counter:number){
    this.childrens[counter].title = $('#title_'+counter).val();
  }
  setMrp(counter:number){
    this.childrens[counter].mrp = $('#mrp_'+counter).val();
  }
  setDiscount(counter:number){
    this.childrens[counter].discount = $('#discount_'+counter).val();
  }
  setDiscountType(counter:number){
    this.childrens[counter].discount_type = $('#discount_type_'+counter).val();
  }
  getClasses() {
    this.appService
      .getData('get/classes/list/add/1')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          var r: any = res;
          if (r.success) {
            this.classes = r.users;
          } else {
            this.toastr.error('Carrier not loading', 'Error');
          }
        },
        (error) => {
          this.toastr.error('Server Error', 'Error');
        }
      );
  }
  getBoards(){
    this.appService.getData('get/boards/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.boards = r.users;
      }else{
        this.toastr.error("Board not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getSubjects(){
    this.appService.getData('get/subjects/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.subjects = r.users;
      }else{
        this.toastr.error("Carrier not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  checkPermission(){
    this.appService.getData('check/permission/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){}else{
        this.router.navigateByUrl('/dashboard');
      }
    });
  }
  createPackage(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      token: localStorage.getItem('token'),
      category: form.category,
      type: form.type,
      title: form.title,
      heading: form.heading,
      description: form.description,
      price: form.price,
      class_id:form.class_id,
      duration_days:form.duration_days,
      tution_hour:form.tution_hour,
      subject:form.subject,
      board:form.board,
      mrp:form.mrp,
      discount:form.discount,
      discount_type:form.discount_type,
      child_rows:this.childrens
    };
    this.appService.postData('student-package/create',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Submit');
      if(r.success){
        this.toastr.success(r.message,"Success");
        this.router.navigateByUrl('student-packages');
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
}
