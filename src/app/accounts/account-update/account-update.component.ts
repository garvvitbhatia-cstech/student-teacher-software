import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-account-update',
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.css']
})
export class AccountUpdateComponent implements OnInit {

  AccountID:any;
  user:any;
  form: FormGroup;
  destroy$ = new Subject();
  countries:any;
  managers:any;
  cities:any;
  managerIds:any = [];
  permissions:any = {};
 

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
      phone: ['', Validators.required],
      password: ['', Validators.required],
      allow_for_city: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.AccountID = this.route.snapshot.params['idAccount'];
    this.getUserInfo(this.AccountID);
    this.getCities();
    
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getCities(){
    const data = {
      token: localStorage.getItem('token')
    };
    this.appService.postData('franchise/list/all',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.cities = r.users;
    });
  }
  onChangePermission(event:any,roleTitle:string,type:string){
    if(event.target.checked){
      this.permissions[roleTitle][type] = true;
    }else{
      this.permissions[roleTitle][type] = false;
    }
  }
  onChangeCategory(event:any,userID:number) {
    
    if(event.target.checked){
      this.managerIds.push({
        user_id: userID
      });
      //this.invoiceRow.push(invoiceID);
    }else{
      const index = this.managerIds.findIndex(function(managerIds:any) {
        return managerIds.user_id == userID
      });
      //const index = this.invoiceRow.indexOf(invoiceID);
      if (index > -1) { // only splice array when item is found
        this.managerIds.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
  }
  getManagers(access:any,permissions:any){
    const data = {
      token: localStorage.getItem('token'),
      access:access,
      permissions:permissions
    };
    this.appService.postData('managers/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.managers = r.managers;
       if(permissions!=""){
        this.permissions = JSON.parse(permissions);
      }else{ 
        this.managers.forEach((element:any) => {
       
          this.permissions[element.slug] = {};
            this.permissions[element.slug] = {
            'add' : false,
            'edit' : false,
            'view' : false,
            'delete' : false,
            'export' : false,
            'import' : false,
            'self' : false,
            'review' : false,
          };  
        });
     }

     console.log(this.permissions);
      
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  getCountries(){
    this.appService.getData('countries/get').pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.countries = r.data;
    });
  }
  getUserInfo(id:number){
    this.appService.getData('account/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.permission){
        this.user = r.data;
        this.form.controls['name'].setValue(r.data.name);
        this.form.controls['email'].setValue(r.data.email);
        this.form.controls['phone'].setValue(r.data.phone);
        this.form.controls['allow_for_city'].setValue(r.data.allow_for_city);
        this.form.controls['role'].setValue(r.data.role);
        r.permissions.forEach((element:any) => {
          this.managerIds.push({
            user_id: element
          });
        });
        this.getManagers(r.data.access,r.data.permissions);
      }else{
        this.router.navigateByUrl('/dashboard');
      }
    },error=>{
      this.toastr.error("Server Error","Error");
    });
  }
  updateUser(form: any){
    $('#submitBtn').html('Processing');
    const data = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      allow_for_city: form.allow_for_city,
      role: form.role,
      access:this.managerIds,
      permissions: this.permissions
    };
    this.appService.postData('account/update/'+this.AccountID,data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
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