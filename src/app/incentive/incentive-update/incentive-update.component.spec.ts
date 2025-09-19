import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveUpdateComponent } from './incentive-update.component';

describe('IncentiveUpdateComponent', () => {
  let component: IncentiveUpdateComponent;
  let fixture: ComponentFixture<IncentiveUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
