import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-tutor-registration',
  templateUrl: './edit-tutor-registration.component.html',
  styleUrls: ['./edit-tutor-registration.component.css']
})
export class EditTutorRegistrationComponent implements OnInit,OnDestroy {

  userID:any;
  user:any;
  userData:any;
  stateList:any;
  form: FormGroup;
  destroy$ = new Subject();
  login_user_type = localStorage.getItem('login_user_type');

  boards:any;
  classes:any;
  subjects:any;
  franchises:any;

  aadhar_client_id:any = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    public fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
      contact: ['', Validators.required],
      whatsaapp: ['', Validators.required],
      current_address: ['', Validators.required],
      pincode: ['', Validators.required],
      owned_vehicle: ['', Validators.required],
      document_verify: ['', Validators.required],
      aadhaar: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      board: ['', Validators.required],
      class: ['', Validators.required],
      subjects: ['', Validators.required],
      bank_name: ['', Validators.required],
      account_number: ['', Validators.required],
      ifsc: ['', Validators.required],
      branch: ['', Validators.required],
      upi_id: ['', Validators.required],
      about_us: ['', Validators.required],
      email: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      middle_name: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      father_name: ['', Validators.required],
      mother_name: ['', Validators.required],
      husband_name: ['', Validators.required],
      permanent_address: ['', Validators.required],
      pincode_2: ['', Validators.required],
      rating: ['', Validators.required],
      prefered_location: ['', Validators.required],
      prefered_location_2: ['', Validators.required],
      prefered_location_3: ['', Validators.required],
      prefered_location_4: ['', Validators.required],
      prefered_location_5: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getAllFranchise();
    this.userID = this.route.snapshot.params['idEnquiry'];
    this.getBoards();
    this.getClasses();
    this.getSubjects();
    this.getUserInfo(this.userID); 
    this.getStates();
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getUserInfo(id:number){
    this.appService.getData('tutor-registration/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.userData = r.data;
        this.form.controls['state_id'].setValue(r.data.state_id);
        this.form.controls['city_id'].setValue(r.data.city_id);
        this.form.controls['contact'].setValue(r.data.contact);
        this.form.controls['whatsaapp'].setValue(r.data.whatsaapp);
        this.form.controls['current_address'].setValue(r.data.current_address);
        this.form.controls['pincode'].setValue(r.data.pincode);
        this.form.controls['owned_vehicle'].setValue(r.data.owned_vehicle);
        this.form.controls['document_verify'].setValue(r.data.document_verify);
        this.form.controls['aadhaar'].setValue(r.data.aadhaar);
        this.form.controls['latitude'].setValue(r.data.latitude);
        this.form.controls['longitude'].setValue(r.data.longitude);
        this.form.controls['board'].setValue(r.data.board);
        this.form.controls['class'].setValue(r.data.class);
        this.form.controls['subjects'].setValue(r.data.subjects);
        this.form.controls['bank_name'].setValue(r.data.bank_name);
        this.form.controls['account_number'].setValue(r.data.account_number);
        this.form.controls['ifsc'].setValue(r.data.ifsc);
        this.form.controls['branch'].setValue(r.data.branch);
        this.form.controls['upi_id'].setValue(r.data.upi_id);
        this.form.controls['about_us'].setValue(r.data.about_us);
        this.form.controls['email'].setValue(r.data.email);
        this.form.controls['first_name'].setValue(r.data.first_name);
        this.form.controls['last_name'].setValue(r.data.last_name);
        this.form.controls['middle_name'].setValue(r.data.middle_name);
        this.form.controls['dob'].setValue(r.data.dob);
        this.form.controls['gender'].setValue(r.data.gender);
        this.form.controls['father_name'].setValue(r.data.father_name);
        this.form.controls['mother_name'].setValue(r.data.mother_name);
        this.form.controls['husband_name'].setValue(r.data.husband_name);
        this.form.controls['permanent_address'].setValue(r.data.permanent_address);
        this.form.controls['pincode_2'].setValue(r.data.pincode_2);
        this.form.controls['rating'].setValue(r.data.rating);
        this.form.controls['prefered_location'].setValue(r.data.prefered_location);
        this.form.controls['prefered_location_2'].setValue(r.data.prefered_location_2);
        this.form.controls['prefered_location_3'].setValue(r.data.prefered_location_3);
        this.form.controls['prefered_location_4'].setValue(r.data.prefered_location_4);
        this.form.controls['prefered_location_5'].setValue(r.data.prefered_location_5);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateSubject(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      city_id:form.city_id,
      contact:form.contact,
      whatsaapp:form.whatsaapp,
      current_address:form.current_address,
      pincode:form.pincode,
      owned_vehicle:form.owned_vehicle,
      document_verify:form.document_verify,
      aadhaar:form.aadhaar,
      latitude:form.latitude,
      longitude:form.longitude,
      board:form.board,
      class:form.class,
      subjects:form.subjects,
      bank_name:form.bank_name,
      account_number:form.account_number,
      ifsc:form.ifsc,
      branch:form.branch,
      upi_id:form.upi_id,
      about_us:form.about_us,
      type:'FULL',
      email:form.email,
      first_name:form.first_name,
      last_name:form.last_name,
      state_id:form.state_id,
      middle_name:form.middle_name,
      dob:form.dob,
      gender:form.gender,
      father_name:form.father_name,
      mother_name:form.mother_name,
      husband_name:form.husband_name,
      permanent_address:form.permanent_address,
      pincode_2:form.pincode_2,
      rating:form.rating,
      prefered_location:form.prefered_location,
      prefered_location_2:form.prefered_location_2,
      prefered_location_3:form.prefered_location_3,
      prefered_location_4:form.prefered_location_4,
      prefered_location_5:form.prefered_location_5,
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
  getAllFranchise(){
    var form = {token: localStorage.getItem('token')};
    this.appService.postData('franchise/list/all',form).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.franchises = r.users;
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
  

}
