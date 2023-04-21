import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../shared/services/account/account.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(
    private router: Router,
    private accountServece: AccountService
  ) {}

  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('monosushi_currentUser');
    this.accountServece.isUserLogin$.next(true);
  }

}
