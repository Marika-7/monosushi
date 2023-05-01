import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent implements OnInit {

  public personForm!: FormGroup;
  public isPerson = true;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.initPersonForm();
  }

  initPersonForm(): void {
    const currentUser = JSON.parse(localStorage.getItem('monosushi_currentUser') as string);
    this.personForm = this.fb.group({
      firstName: [currentUser.firstName, Validators.required],
      lastName: [currentUser.lastName, Validators.required],
      phoneNumber: [currentUser.phoneNumber, Validators.required],
      email: [currentUser.email, [Validators.required, Validators.email]]
    });
  }

  showPerson(): void {
    this.isPerson = true;
  }

  showOrders(): void {
    this.isPerson = false;
  }

  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('monosushi_currentUser');
    this.accountService.isUserLogin$.next(true);
  }

}
