import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAddressCreateComponent } from './teacher-address-create.component';

describe('TeacherAddressCreateComponent', () => {
  let component: TeacherAddressCreateComponent;
  let fixture: ComponentFixture<TeacherAddressCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAddressCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAddressCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
