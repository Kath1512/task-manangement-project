import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDetail } from './staff-detail';

describe('StaffDetail', () => {
  let component: StaffDetail;
  let fixture: ComponentFixture<StaffDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
