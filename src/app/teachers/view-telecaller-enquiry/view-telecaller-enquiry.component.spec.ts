import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTelecallerEnquiryComponent } from './view-telecaller-enquiry.component';

describe('ViewTelecallerEnquiryComponent', () => {
  let component: ViewTelecallerEnquiryComponent;
  let fixture: ComponentFixture<ViewTelecallerEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTelecallerEnquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTelecallerEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
