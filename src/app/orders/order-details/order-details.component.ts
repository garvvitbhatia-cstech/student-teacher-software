import { Component, OnInit,OnDestroy } from '@angular/core';
import { AppService } from '../../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  details:any;
  rowID:any;
  form: FormGroup;
  destroy$ = new Subject();

  constructor(
    private appService: AppService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    ) {
      this.form = this.fb.group({
        teacher_commission: ['', Validators.required]
      });
     }

  ngOnInit(): void {
    this.rowID = this.route.snapshot.params['idRow'];
    this.getOrderData(this.rowID);
  }
  ngOnDestroy() {
    this.destroy$.complete();
  }
  getOrderData(id:any){
    this.appService.getData('order/get/'+id).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.details = r.data;
    });
  }
  printInvoice(){
    window.print();
    return true;
  }

}
