import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurComponent } from './recur.component';

describe('RecurComponent', () => {
  let component: RecurComponent;
  let fixture: ComponentFixture<RecurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
