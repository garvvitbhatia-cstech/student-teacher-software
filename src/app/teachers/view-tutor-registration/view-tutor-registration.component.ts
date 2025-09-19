import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-tutor-registration',
  templateUrl: './view-tutor-registration.component.html',
  styleUrls: ['./view-tutor-registration.component.css']
})
export class ViewTutorRegistrationComponent implements OnInit,OnDestroy {

  userID:any;
  user:any;
  userData:any;
  form: FormGroup;
  destroy$ = new Subject();
  login_user_type = localStorage.getItem('login_user_type');

  boards:any;
  classes:any;
  subjects:any;
  franchises:any;

  contact:any;
  
  add_p:any;
  edit_p:any;
  view_p:any;
  delete_p:any;
  export_p:any;
  import_p:any;
  self_p:any;
  review_p:any;

  aadhar_client_id:any = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      document_verify: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getAllFranchise();
    this.userID = this.route.snapshot.params['idEnquiry'];
    this.getBoards();
    this.getClasses();
    this.getSubjects();
    this.getUserInfo(this.userID); 
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getAllFranchise(){
    var form = {token: localStorage.getItem('token')};
    this.appService.postData('franchise/list/all',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.franchises = r.users;
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getBoards(){
    this.appService.getData('get/boards/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
    this.appService.getData('get/classes/list/add/1').pipe(takeUntil(this.destroy$)).subscribe(res=>{
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
  updateStatus(faqID:string,status:string){
    const data = {};
    this.appService.putData('tutor-registration/status/update/'+faqID+'/'+status,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        if(status == '3'){
          Swal.fire(
            'Removed!',
            'Record removed successfully.',
            'success'
          )
        }
        this.getUserInfo(this.userID);
      }else{
        Swal.fire(
          'Error',
          r.message,
          'error'
        )
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateSubject(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      document_verify:form.document_verify,
      contact:this.contact,
      type:'SHORT'

    };
    this.appService.putData('tutor/enquiry/update/'+this.userID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      $('#submitBtn').html('Update');
      if(r.success){
        this.toastr.success(r.message,"Success");
      }else{
        this.toastr.error(r.message,"Error");
      }
    });
  }
  SendAadharOtp(){
    if(this.userData.aadhaar != ""){
      $('#send_aadhar_otp_btn').html('Processing...');
      const data = {
        token: localStorage.getItem('token'),
        aadhar_no:this.userData.aadhaar
      };
      this.appService.postData('send-aadhar-otp',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
        var r:any=res;
        $('#send_aadhar_otp_btn').html('Send OTP');
        if(r.success){
          this.aadhar_client_id = r.client_id;
          this.toastr.success(r.message,"Success");
        }else{
          this.toastr.error(r.message,"Error");
        }
        
      },error=>{
        this.toastr.error("Server Error","Error");
      });
    }else{
      this.toastr.error('Aadhar not exist',"Error");
    }
  }
  VerifyAadharOTP(){
    if($('#aadhar_otp').val() == ''){
      this.toastr.error('Please enter aadhar OTP',"Error");
    }else{
      if(this.aadhar_client_id != ""){
        $('#v_aadhar_otp_btn').html('Processing...');
        const data = {
          token: localStorage.getItem('token'),
          aadhar_client_id:this.aadhar_client_id,
          otp:$('#aadhar_otp').val()
        };
        this.appService.postData('verify-aadhar-otp',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
          var r:any=res;
          $('#v_aadhar_otp_btn').html('Verify OTP');
          if(r.success){
            this.getUserInfo(this.userID); 
            this.toastr.success(r.message,"Success");
          }else{
            this.toastr.error(r.message,"Error");
          }
        },error=>{
          this.toastr.error("Server Error","Error");
        });
      }else{
        this.toastr.error('Aadhar client id not exist',"Error");
      }
    }
  }
  getUserInfo(id:number){
    this.appService.getData('tutor-registration/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.userData = r.data;
        this.contact = r.data.contact;
        this.form.controls['document_verify'].setValue(r.data.document_verify);

        this.add_p = r.access.add;
        this.edit_p = r.access.edit;
        this.view_p = r.access.view;
        this.delete_p = r.access.delete;
        this.export_p = r.access.export;
        this.import_p = r.access.import;
        this.self_p = r.access.self;
        this.review_p = r.access.review;

      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }

}
