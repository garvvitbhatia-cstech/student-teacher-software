import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerUpdateComponent } from './partner-update.component';

describe('PartnerUpdateComponent', () => {
  let component: PartnerUpdateComponent;
  let fixture: ComponentFixture<PartnerUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
