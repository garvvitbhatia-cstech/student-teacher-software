import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContactSupportComponent } from './view-contact-support.component';

describe('ViewContactSupportComponent', () => {
  let component: ViewContactSupportComponent;
  let fixture: ComponentFixture<ViewContactSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContactSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContactSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
