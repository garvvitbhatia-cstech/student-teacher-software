import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPackagesComponent } from './student-packages.component';

describe('StudentPackagesComponent', () => {
  let component: StudentPackagesComponent;
  let fixture: ComponentFixture<StudentPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
