import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTutorRegistrationComponent } from './edit-tutor-registration.component';

describe('EditTutorRegistrationComponent', () => {
  let component: EditTutorRegistrationComponent;
  let fixture: ComponentFixture<EditTutorRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTutorRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTutorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
