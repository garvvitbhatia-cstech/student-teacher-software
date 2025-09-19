import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPayNowComponent } from './teacher-pay-now.component';

describe('TeacherPayNowComponent', () => {
  let component: TeacherPayNowComponent;
  let fixture: ComponentFixture<TeacherPayNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherPayNowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherPayNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
