import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialUpdateComponent } from './testimonial-update.component';

describe('TestimonialUpdateComponent', () => {
  let component: TestimonialUpdateComponent;
  let fixture: ComponentFixture<TestimonialUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
