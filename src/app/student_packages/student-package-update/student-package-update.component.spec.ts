import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPackageUpdateComponent } from './student-package-update.component';

describe('StudentPackageUpdateComponent', () => {
  let component: StudentPackageUpdateComponent;
  let fixture: ComponentFixture<StudentPackageUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPackageUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPackageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
