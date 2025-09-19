import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPackageUpdateComponent } from './teacher-package-update.component';

describe('TeacherPackageUpdateComponent', () => {
  let component: TeacherPackageUpdateComponent;
  let fixture: ComponentFixture<TeacherPackageUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherPackageUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherPackageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
