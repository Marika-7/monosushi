import { Component, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';

export interface IRegister {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {

  public loginForm!: FormGroup;
  public registerForm!: FormGroup;
  public loginSubscription!: Subscription;
  public isLogin = true;
  private registerData!: IRegister;
  public checkPassword = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private auth: Auth,
    private afs: Firestore,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    this.initRegisterForm();
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  initRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  loginUser(): void {
    const { email, password } = this.loginForm.value;
    this.login(email, password)
      .then(() => {
        this.toastr.success('Ваш кабінет');
      }).catch(err => {
        this.toastr.error('Не вірний логін або пароль');
      })
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid))
      .subscribe(user => {
        const currentUser = { ...user, uid: credential.user.uid };
        localStorage.setItem('monosushi_currentUser', JSON.stringify(currentUser));
        if (user && user['role'] === ROLE.USER) {
          this.router.navigate(['/cabinet']);
        } else if (user && user['role'] === ROLE.ADMIN) {
          this.router.navigate(['/admin']);
        }
        this.accountService.isUserLogin$.next(true);
      }, (err) => {
        console.log('error', err);
      })
  }

  registerUser(): void {
    const { email, password } = this.registerForm.value;
    this.registerData = this.registerForm.value;
    this.emailSignUp(email, password)
      .then(() => {
        this.toastr.success('Новий аккаунт створено');
        this.isLogin = !this.isLogin;
        this.registerForm.reset();
      }).catch(err => {
        this.toastr.error(err.message.slice(10));
      })
  }

  async emailSignUp(email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: credential.user.email,
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      phoneNumber: this.registerData.phoneNumber,
      adress: '',
      role: 'USER',
      orders: []
    };
    setDoc(doc(this.afs, 'users', credential.user.uid), user);
  }

  changeIsLogin(): void {
    this.isLogin = !this.isLogin;
  }

  checkConfirmedPassword(): void {
    this.checkPassword = this.password.value === this.confirmed.value;
    if (this.password.value !== this.confirmed.value) {
      this.registerForm.controls['confirmPassword'].setErrors({
        matchError: 'Пароль не співпадає'
      });
      this.toastr.error('Пароль не співпадає');
    }
  }

  get password(): AbstractControl {
    return this.registerForm.controls['password'];
  }

  get confirmed(): AbstractControl {
    return this.registerForm.controls['confirmPassword'];
  }

  checkVisibilityError(control: string, name: string): boolean | null {
    return this.registerForm.controls[control].errors?.[name];
  }

}
