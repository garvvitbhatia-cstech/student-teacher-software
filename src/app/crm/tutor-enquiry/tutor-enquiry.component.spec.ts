import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorEnquiryComponent } from './tutor-enquiry.component';

describe('TutorEnquiryComponent', () => {
  let component: TutorEnquiryComponent;
  let fixture: ComponentFixture<TutorEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorEnquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
