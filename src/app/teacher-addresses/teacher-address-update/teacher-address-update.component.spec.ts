import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAddressUpdateComponent } from './teacher-address-update.component';

describe('TeacherAddressUpdateComponent', () => {
  let component: TeacherAddressUpdateComponent;
  let fixture: ComponentFixture<TeacherAddressUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAddressUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAddressUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
