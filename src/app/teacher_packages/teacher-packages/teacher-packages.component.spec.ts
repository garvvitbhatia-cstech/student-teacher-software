import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPackagesComponent } from './teacher-packages.component';

describe('TeacherPackagesComponent', () => {
  let component: TeacherPackagesComponent;
  let fixture: ComponentFixture<TeacherPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
