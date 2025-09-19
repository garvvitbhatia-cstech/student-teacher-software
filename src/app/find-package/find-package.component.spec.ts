import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPackageComponent } from './find-package.component';

describe('FindPackageComponent', () => {
  let component: FindPackageComponent;
  let fixture: ComponentFixture<FindPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
