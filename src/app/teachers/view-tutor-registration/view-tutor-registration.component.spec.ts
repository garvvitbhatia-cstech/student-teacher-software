import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTutorRegistrationComponent } from './view-tutor-registration.component';

describe('ViewTutorRegistrationComponent', () => {
  let component: ViewTutorRegistrationComponent;
  let fixture: ComponentFixture<ViewTutorRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTutorRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTutorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
