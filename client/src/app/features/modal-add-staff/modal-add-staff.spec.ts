import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddStaff } from './modal-add-staff';

describe('ModalAddStaff', () => {
  let component: ModalAddStaff;
  let fixture: ComponentFixture<ModalAddStaff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddStaff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddStaff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
