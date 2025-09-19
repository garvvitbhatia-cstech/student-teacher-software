import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocFollowupDataComponent } from './doc-followup-data.component';

describe('DocFollowupDataComponent', () => {
  let component: DocFollowupDataComponent;
  let fixture: ComponentFixture<DocFollowupDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocFollowupDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocFollowupDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
