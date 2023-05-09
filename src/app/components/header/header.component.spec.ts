import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the opposite value', () => {
    const startValue = component.burgerIsOpen;
    component.toggleBurgerMenu();
    expect(component.burgerIsOpen).not.toBe(startValue);
  });

  it('should set value to false', () => {
    component.burgerIsOpen = true;
    component.closeBurgerMenu();
    expect(component.burgerIsOpen).toBeFalse;
  });

  it('should change total price and count', () => {
    const FAKE_BASKET = [
      {
        id: 1,
        category: {
          id: 2,
          name: 'string',
          path: 'string',
          imagePath: 'string',
        },
        name: 'string',
        path: 'string',
        description: 'string',
        weight: 'string',
        price: 510,
        imagePath: 'string',
        count: 3
      }
    ];
    component.basket = FAKE_BASKET;
    spyOn(component, 'getTotalPrice').and.callThrough();
    component.getTotalPrice();
    expect(component.getTotalPrice).toHaveBeenCalled();
    expect(component.totalPrice).toBe(1530);
    expect(component.totalCount).toBe(3);
    component.basket = [];
    component.getTotalPrice();
    expect(component.getTotalPrice).toHaveBeenCalled();
    expect(component.totalPrice).toBe(0);
    expect(component.totalCount).toBe(0);
  });

  it('should change count', () => {
    const currentProduct = {
      id: 1,
        category: {
          id: 2,
          name: 'string',
          path: 'string',
          imagePath: 'string',
        },
        name: 'string',
        path: 'string',
        description: 'string',
        weight: 'string',
        price: 510,
        imagePath: 'string',
        count: 1
    }
    component.productCount(currentProduct, true);
    expect(currentProduct.count).toBe(2);
    component.productCount(currentProduct, false);
    expect(currentProduct.count).toBe(1);
    component.productCount(currentProduct, false);
    expect(currentProduct.count).toBe(1);
  });

  it('should write data to localStorage', () => {
    const currentProduct = {
      id: 1,
        category: {
          id: 2,
          name: 'string',
          path: 'string',
          imagePath: 'string',
        },
        name: 'string',
        path: 'string',
        description: 'string',
        weight: 'string',
        price: 510,
        imagePath: 'string',
        count: 1
    };
    component.productCount(currentProduct, true);
    let data = JSON.parse(localStorage.getItem('monosushi_basket') as string);
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBeTrue();
  });

});
