import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPackageCreateComponent } from './teacher-package-create.component';

describe('TeacherPackageCreateComponent', () => {
  let component: TeacherPackageCreateComponent;
  let fixture: ComponentFixture<TeacherPackageCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherPackageCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherPackageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
