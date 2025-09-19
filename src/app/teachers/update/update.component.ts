import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit,OnDestroy {

  userID:any;
  user:any;
  form: FormGroup;
  classes:any;
  boards:any;
  subjects:any;
  destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      qualification: ['', Validators.required],
      subject: ['', Validators.required],
      class: ['', Validators.required],
      board: ['', Validators.required],
      fees: ['', Validators.required],
      teaching_exp: ['', Validators.required],
      zipcode: ['', Validators.required],
      pan_no: ['', Validators.required],
      aadhar_no: ['', Validators.required],
      about_us: ['', Validators.required],
      current_latitude: ['', Validators.required],
      current_longitude: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      address: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userID = this.route.snapshot.params['idUser'];
    this.getUserInfo(this.userID);
    this.getClasses();
    this.getSubjects();
    this.getBoards();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  createBeneficiary(){
    $('#c_beni').html('Processing...');
    var formData = {user_id:this.userID,token:localStorage.getItem('token')};
    this.appService.postData('/super/admin/create/beneficiary',formData).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#c_beni').html('Create Beneficiary');
      this.getUserInfo(this.userID);
      if(r.success){
        this.toastr.success(r.message,"Error");
      }else{
        this.toastr.error(r.message,"Error");
      }

      
    });
  }
  getBoards(){
    this.appService.getData('get/boards/list/edit/'+ this.userID).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
  getClasses(){
    this.appService.getData('get/classes/list/edit/'+ this.userID).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
  getSubjects(){
    this.appService.getData('get/subjects/list/edit/'+ this.userID).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
    this.appService.getData('super/admin/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.user = r.data;
        this.form.controls['name'].setValue(r.data.name);
        this.form.controls['email'].setValue(r.data.email);
        this.form.controls['phone'].setValue(r.data.phone);
        this.form.controls['zipcode'].setValue(r.data.zipcode);
        this.form.controls['qualification'].setValue(r.data.qualification);
        this.form.controls['subject'].setValue(r.data.subject);
        this.form.controls['board'].setValue(r.data.board);
        this.form.controls['fees'].setValue(r.data.fees);
        this.form.controls['class'].setValue(r.data.class);
        this.form.controls['teaching_exp'].setValue(r.data.teaching_exp);
        this.form.controls['pan_no'].setValue(r.data.pan_no);
        this.form.controls['aadhar_no'].setValue(r.data.aadhar_no);
        this.form.controls['about_us'].setValue(r.data.about_us);
        this.form.controls['current_latitude'].setValue(r.data.current_latitude);
        this.form.controls['current_longitude'].setValue(r.data.current_longitude);
        this.form.controls['lat'].setValue(r.data.lat);
        this.form.controls['lng'].setValue(r.data.lng);
        this.form.controls['address'].setValue(r.data.address);
        this.form.controls['rating'].setValue(r.data.rating);

        $('#tutor_location').attr('src','https://maps.google.com/maps?q='+r.data.lat+','+r.data.lng+'&hl=es;z=14&output=embed');
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateUser(form: any){
    $('#submitBtn').html('Processing');
    var file_data = $('#profile_image').prop('files')[0];
    var subjects = form.subject;
    var classes = form.class;
    var board = form.board;
    var formData  = new FormData();
    formData.append('token',localStorage.getItem('token') as string);
    formData.append('name',$('#name').val() as string);
    formData.append('email',$('#email').val() as string);
    formData.append('password',$('#password').val() as string);
    formData.append('confirm_password',$('#confirm_password').val() as string);
    formData.append('phone',$('#phone').val() as string);
    formData.append('zipcode',$('#zipcode').val() as string);
    formData.append('access',$('#access').val() as string);
    formData.append('qualification',$('#qualification').val() as string);
    formData.append('board', board);
    formData.append('subject', subjects);
    formData.append('class', classes);
    formData.append('fees',$('#fees').val() as string);
    formData.append('teaching_exp',$('#teaching_exp').val() as string);
    formData.append('pan_no',$('#pan_no').val() as string);
    formData.append('about_us',$('#about_us').val() as string);
    formData.append('current_latitude',$('#current_latitude').val() as string);
    formData.append('current_longitude',$('#current_longitude').val() as string);
    formData.append('lat',$('#lat').val() as string);
    formData.append('lng',$('#lng').val() as string);
    formData.append('file',file_data);
    formData.append('address',$('#address').val() as string);
    formData.append('rating',$('#rating').val() as string);
    this.appService.postData('super/admin/update/'+this.userID,formData).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
