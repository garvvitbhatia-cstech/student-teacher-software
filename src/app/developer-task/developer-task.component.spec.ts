import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperTaskComponent } from './developer-task.component';

describe('DeveloperTaskComponent', () => {
  let component: DeveloperTaskComponent;
  let fixture: ComponentFixture<DeveloperTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeveloperTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
