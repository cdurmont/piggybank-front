import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPropertiesComponent } from './account-properties.component';

describe('AccountPropertiesComponent', () => {
  let component: AccountPropertiesComponent;
  let fixture: ComponentFixture<AccountPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
