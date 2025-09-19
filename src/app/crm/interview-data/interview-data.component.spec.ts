import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewDataComponent } from './interview-data.component';

describe('InterviewDataComponent', () => {
  let component: InterviewDataComponent;
  let fixture: ComponentFixture<InterviewDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
