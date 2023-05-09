import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetComponent } from './cabinet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('CabinetComponent', () => {
  let component: CabinetComponent;
  let fixture: ComponentFixture<CabinetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabinetComponent ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabinetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set values null for inputs', () => {
    const testValues = {
      oldPassword: null,
      newPassword: null,
      confirmPassword: null
    };
    component.initPasswordForm();
    expect(component.passwordForm.value).toEqual(testValues);
  });

  it('.showPerson should change values', () => {
    component.isPerson = false;
    component.isEditPassword = true;
    component.showPerson();
    expect(component.isPerson).toBeTrue();
    expect(component.isEditPassword).toBeFalse();
  });

  it('.showOrders should change values', () => {
    component.isPerson = true;
    component.isEditPassword = true;
    component.showOrders();
    expect(component.isPerson).toBeFalse();
    expect(component.isEditPassword).toBeFalse();
  });

  it('.showEditPassword should change values', () => {
    component.isPerson = true;
    component.isEditPassword = false;
    component.showEditPassword();
    expect(component.isPerson).toBeFalse();
    expect(component.isEditPassword).toBeTrue();
  });

  it('should delete data of user from memory', () => {
    localStorage.setItem('monosushi_currentUser', JSON.stringify('testData'));
    component.logout();
    const userData = localStorage.getItem('monosushi_currentUser');
    expect(userData).toBe(null);
  });

});
