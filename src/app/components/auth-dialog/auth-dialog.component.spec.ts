import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthDialogComponent } from './auth-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthDialogComponent', () => {
  let component: AuthDialogComponent;
  let fixture: ComponentFixture<AuthDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthDialogComponent ],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: Auth, useValue: {} },
        { provide: Firestore, useValue: {} },
        { provide: ToastrService, useValue: {} }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set values null for inputs', () => {
    const testValues = {
      email: null,
      password: null
    };
    component.initLoginForm();
    expect(component.loginForm.value).toEqual(testValues);
  });

  it('should set values null for inputs', () => {
    const testValues = {
      firstName: null,
      lastName: null,
      phoneNumber: null,
      email: null,
      password: null,
      confirmPassword: null
    };
    component.initRegisterForm();
    expect(component.registerForm.value).toEqual(testValues);
  });

  it('should set the opposite value', () => {
    const startValue = component.isLogin;
    component.changeIsLogin();
    expect(component.isLogin).not.toBe(startValue);
  });

});
