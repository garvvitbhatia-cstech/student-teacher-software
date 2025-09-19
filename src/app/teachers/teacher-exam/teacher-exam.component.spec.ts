import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherExamComponent } from './teacher-exam.component';

describe('TeacherExamComponent', () => {
  let component: TeacherExamComponent;
  let fixture: ComponentFixture<TeacherExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherExamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
