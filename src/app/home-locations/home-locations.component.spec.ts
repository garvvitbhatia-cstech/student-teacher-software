import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLocationsComponent } from './home-locations.component';

describe('HomeLocationsComponent', () => {
  let component: HomeLocationsComponent;
  let fixture: ComponentFixture<HomeLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
