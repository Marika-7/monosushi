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

  public userOrders = [
    {
      "id": "10",
      "data": "08.10.2022 18:47:25",
      "adress": "Самовивіз",
      "products": [
        {
          "id": "10",
          "name": "Запечені моно макі з лососем",
          "count": "1"
        },
        {
          "id": "2",
          "name": "Запечений сет",
          "count": "1"
        }
      ],
      "sum": "960",
      "status": "виконано"
    },
    {
      "id": "4",
      "data": "07.10.2022 18:22:02",
      "adress": "Львів, вулиця Франка 61",
      "products": [
        {
          "id": "2",
          "name": "Запечений сет",
          "count": "1"
        }
      ],
      "sum": "510",
      "status": "виконано"
    },
    {
      "id": "1",
      "data": "06.10.2022 19:20:28",
      "adress": "Самовивіз",
      "products": [
        {
          "id": "10",
          "name": "Запечені моно макі з лососем",
          "count": "1"
        }
      ],
      "sum": "450",
      "status": "виконано"
    }
  ];
  public personForm!: FormGroup;
  public passwordForm!: FormGroup;
  public isPerson = true;
  public isEditPassword = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.initPersonForm();
    this.initPasswordForm();
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

  initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  showPerson(): void {
    this.isPerson = true;
    this.isEditPassword = false;
  }

  showOrders(): void {
    this.isPerson = false;
    this.isEditPassword = false;
  }

  showEditPassword(): void {
    this.isPerson = false;
    this.isEditPassword = true;
  }

  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('monosushi_currentUser');
    this.accountService.isUserLogin$.next(true);
  }

}
