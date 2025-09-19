import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveCreateComponent } from './incentive-create.component';

describe('IncentiveCreateComponent', () => {
  let component: IncentiveCreateComponent;
  let fixture: ComponentFixture<IncentiveCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
