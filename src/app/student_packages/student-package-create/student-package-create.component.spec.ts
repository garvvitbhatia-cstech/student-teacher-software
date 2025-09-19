import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPackageCreateComponent } from './student-package-create.component';

describe('StudentPackageCreateComponent', () => {
  let component: StudentPackageCreateComponent;
  let fixture: ComponentFixture<StudentPackageCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPackageCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPackageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
