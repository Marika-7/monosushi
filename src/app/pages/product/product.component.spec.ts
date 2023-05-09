import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize eventSubscription', () => {
    expect(component.eventSubscription).toBeDefined();
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
    };
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
    component.addToBasket(currentProduct);
    let data = JSON.parse(localStorage.getItem('monosushi_basket') as string);
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBeTrue();
  });

});
