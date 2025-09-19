import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticPageUpdateComponent } from './static-page-update.component';

describe('StaticPageUpdateComponent', () => {
  let component: StaticPageUpdateComponent;
  let fixture: ComponentFixture<StaticPageUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticPageUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticPageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
