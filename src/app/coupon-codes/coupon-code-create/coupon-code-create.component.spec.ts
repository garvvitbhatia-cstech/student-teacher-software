import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCodeCreateComponent } from './coupon-code-create.component';

describe('CouponCodeCreateComponent', () => {
  let component: CouponCodeCreateComponent;
  let fixture: ComponentFixture<CouponCodeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponCodeCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponCodeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
