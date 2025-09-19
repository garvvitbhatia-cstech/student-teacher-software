import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEnquiryComponent } from './student-enquiry.component';

describe('StudentEnquiryComponent', () => {
  let component: StudentEnquiryComponent;
  let fixture: ComponentFixture<StudentEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentEnquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
