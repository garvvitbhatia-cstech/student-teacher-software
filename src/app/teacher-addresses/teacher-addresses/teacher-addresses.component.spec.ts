import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAddressesComponent } from './teacher-addresses.component';

describe('TeacherAddressesComponent', () => {
  let component: TeacherAddressesComponent;
  let fixture: ComponentFixture<TeacherAddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherAddressesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
