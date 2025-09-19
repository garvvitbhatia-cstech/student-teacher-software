import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCodeUpdateComponent } from './coupon-code-update.component';

describe('CouponCodeUpdateComponent', () => {
  let component: CouponCodeUpdateComponent;
  let fixture: ComponentFixture<CouponCodeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponCodeUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponCodeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
