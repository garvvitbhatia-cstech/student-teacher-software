import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialCreateComponent } from './testimonial-create.component';

describe('TestimonialCreateComponent', () => {
  let component: TestimonialCreateComponent;
  let fixture: ComponentFixture<TestimonialCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
