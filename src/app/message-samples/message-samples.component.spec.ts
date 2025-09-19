import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSamplesComponent } from './message-samples.component';

describe('MessageSamplesComponent', () => {
  let component: MessageSamplesComponent;
  let fixture: ComponentFixture<MessageSamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageSamplesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
