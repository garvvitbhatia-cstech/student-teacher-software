import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentUpdateComponent } from './content-update.component';

describe('ContentUpdateComponent', () => {
  let component: ContentUpdateComponent;
  let fixture: ComponentFixture<ContentUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
