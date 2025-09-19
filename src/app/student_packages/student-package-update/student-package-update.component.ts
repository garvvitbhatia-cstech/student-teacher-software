import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-student-package-update',
  templateUrl: './student-package-update.component.html',
  styleUrls: ['./student-package-update.component.css']
})
export class StudentPackageUpdateComponent implements OnInit,OnDestroy {

  packageID:any;
  user:any;
  form: FormGroup;
  destroy$ = new Subject();
  classes: any;
  boards:any;
  subjects:any;
  childrens:any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
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
    this.packageID = this.route.snapshot.params['idPackage'];
    this.getUserInfo(this.packageID);
    this.getClasses();
    this.getSubjects();
    this.getBoards();
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
      status:1,
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
  setStatus(counter:number){
    this.childrens[counter].status = $('#status_'+counter).val();
  }
  setPrice(counter:number){
    this.childrens[counter].price = $('#price_'+counter).val();
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
  setTitle(counter:number){
    this.childrens[counter].title = $('#title_'+counter).val();
  }
  getClasses(){
    this.appService.getData('get/classes/list/edit-package/'+this.packageID).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.classes = r.users;
      }else{
        this.toastr.error("Carrier not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getBoards(){
    this.appService.getData('get/boards/list/add/'+ this.packageID).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        this.boards = r.users;
      }else{
        this.toastr.error("Carrier not loading","Error");
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getSubjects(){
    this.appService.getData('get/subjects/list/add/'+ this.packageID).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
  getUserInfo(id:number){
    this.appService.getData('student-package/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.form.controls['category'].setValue(r.data.category);
        this.form.controls['type'].setValue(r.data.type);
        this.form.controls['title'].setValue(r.data.title);
        this.form.controls['heading'].setValue(r.data.heading);
        this.form.controls['description'].setValue(r.data.description);
        this.form.controls['price'].setValue(r.data.price);
        this.form.controls['class_id'].setValue(r.data.class_id);
        this.form.controls['duration_days'].setValue(r.data.duration_days);
        this.form.controls['tution_hour'].setValue(r.data.tution_hour);
        this.form.controls['subject'].setValue(r.data.subject);
        this.form.controls['board'].setValue(r.data.board);
        this.form.controls['mrp'].setValue(r.data.mrp);
        this.form.controls['discount'].setValue(r.data.discount);
        this.form.controls['discount_type'].setValue(r.data.discount_type);

        r.childrenRows.forEach((element:any) => {
          var obj = {
            id:element.id,
            duration:element.duration_days,
            hours:element.tution_hour,
            price:element.price,
            status:element.status,
            title:element.title,
            mrp:element.mrp,
            discount:element.discount,
            discount_type:element.discount_type
          };
          this.childrens.push(obj);
        });
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateStatus(classID:string,status:string){
    const data = {};
    this.appService.putData('student-package/status/update/'+classID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      window.location.reload();
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  deleteUser(classID:string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
      }).then((result) => {
      if (result.value) {
        this.updateStatus(classID,'3');
        Swal.fire(
          'Removed!',
          'Student package removed successfully.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Student package still in our database.',
        'error'
      )
      }
      })
  }
  updatePackage(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      category: form.category,
      type: form.type,
      title: form.title,
      heading: form.heading,
      description: form.description,
      price: form.price,
      class_id: form.class_id,
      duration_days: form.duration_days,
      tution_hour: form.tution_hour,
      subject: form.subject,
      board: form.board,
      mrp:form.mrp,
      discount:form.discount,
      discount_type:form.discount_type,
      child_rows:this.childrens,
      
    };
    this.appService.putData('student-package/update/'+this.packageID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Update');
      if(r.success){
        this.toastr.success(r.message,"Success");
        window.location.reload();
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
}
