import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { clickOutsideDirective } from "src/app/shared/directives/click-outside.directive";
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public basket: Array<IProductResponse> = [];
  public totalPrice = 0;
  public totalCount = 0;
  public screenIs1200 = false;
  public burgerIsOpen = false;
  public basketIsOpen = false;
  public basketIsEmpty = true;
  public loginUrl = '';

  constructor(
    public breakpoinObserver: BreakpointObserver,
    private orderService: OrderService,
    private accountService: AccountService,
    public dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.breakpoinObserver
      .observe(['(max-width: 1200px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.screenIs1200 = true;
        } else {
          this.screenIs1200 = false;
        }
      });
    this.loadBasket();
    this.updateBasket();
    this.checkUserLogin();
    this.checkUpdatesUserLogin();
  }

  toggleBurgerMenu(): void {
    this.burgerIsOpen = !this.burgerIsOpen;
  }

  closeBurgerMenu(): void {
    this.burgerIsOpen = false
  }

  toggleBasket(): void {
    this.basketIsOpen = !this.basketIsOpen;
  }

  loadBasket(): void {
    if (localStorage.length > 0 && localStorage.getItem('monosushi_basket')) {
      this.basket = JSON.parse(localStorage.getItem('monosushi_basket') as string);
      this.basketIsEmpty = false;
    } else {
      this.basketIsEmpty = true;
    }
    this.getTotalPrice();
  }

  getTotalPrice(): void {
    this.totalPrice = this.basket
      .reduce((total: number, prod: IProductResponse) => 
      total + prod.count * prod.price, 0);
    this.totalCount = this.basket
      .reduce((total: number, prod: IProductResponse) => 
      total + prod.count, 0);
  }

  updateBasket(): void {
    this.orderService.changeBasket.subscribe(() => {
      this.loadBasket();
    })
  }

  productCount(product: IProductResponse, value: boolean): void {
    if (value) {
      ++product.count;
    } else if (!value && product.count > 1) {
      --product.count;
    }
  }

  checkUserLogin(): void {
    const currentUser = JSON.parse(localStorage.getItem('monosushi_currentUser') as string);
    if (currentUser && currentUser.role === ROLE.ADMIN) {
      this.loginUrl = 'admin';
    } else if (currentUser && currentUser.role === ROLE.USER) {
      this.loginUrl = 'cabinet';
    } else {
      this.loginUrl = 'auth';
    }
  }

  checkUpdatesUserLogin(): void {
    this.accountService.isUserLogin$.subscribe(() => {
      this.checkUserLogin();
    })
  }

  openLoginDialog():void {
    this.dialog.open(AuthDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'auth-dialog',
      autoFocus: false
    })
  }

}
