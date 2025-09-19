import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassUpdateComponent } from './class-update.component';

describe('ClassUpdateComponent', () => {
  let component: ClassUpdateComponent;
  let fixture: ComponentFixture<ClassUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
