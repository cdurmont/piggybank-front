import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickinputsComponent } from './quickinputs.component';

describe('QuickinputsComponent', () => {
  let component: QuickinputsComponent;
  let fixture: ComponentFixture<QuickinputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickinputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickinputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
