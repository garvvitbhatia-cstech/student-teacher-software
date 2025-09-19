import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelecallerEnquiryComponent } from './telecaller-enquiry.component';

describe('TelecallerEnquiryComponent', () => {
  let component: TelecallerEnquiryComponent;
  let fixture: ComponentFixture<TelecallerEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelecallerEnquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelecallerEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
