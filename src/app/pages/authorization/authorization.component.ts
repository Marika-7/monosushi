import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit, OnDestroy {

  public authForm!: FormGroup;
  public loginSubscription!: Subscription;

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

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  initAuthForm(): void {
    this.authForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  loginUser(): void {
    const { email, password } = this.authForm.value;
    this.login(email, password)
      .then(() => {
        this.toastr.success('User successfully login');
      }).catch(err => {
        this.toastr.error('Wrong email or password');
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

}
