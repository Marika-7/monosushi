import { Component, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {

  public authFormLogin!: FormGroup;
  public authFormRegister!: FormGroup;
  public loginSubscription!: Subscription;
  public isLogin = true;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private auth: Auth,
    private afs: Firestore,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initAuthForm();
  }

  initAuthForm(): void {
    this.authFormLogin = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
    this.authFormRegister = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      password2: [null, Validators.required]
    });
  }

  loginUser(): void {
    const { email, password } = this.authFormLogin.value;
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
    if (this.authFormRegister.value.password === this.authFormRegister.value.password2) {
      const { email, password } = this.authFormRegister.value;
      this.emailSignUp(email, password)
        .then(() => {
          this.toastr.success('Новий аккаунт створено');
          this.isLogin = !this.isLogin;
          this.authFormRegister.reset();
        }).catch(err => {
          this.toastr.error(err.message.slice(10));
        })
    } else {
      this.toastr.error('Паролі не співпадають');
    }
  }

  async emailSignUp(email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: credential.user.email,
      firstName: this.authFormRegister.value.firstName,
      lastName: this.authFormRegister.value.lastName,
      phoneNumber: this.authFormRegister.value.phoneNumber,
      adress: '',
      role: 'USER',
      orders: []
    };
    setDoc(doc(this.afs, 'users', credential.user.uid), user);
  }

  changeIsLogin(): void {
    this.isLogin = !this.isLogin;
  }

}
