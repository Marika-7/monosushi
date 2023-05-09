import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInfoComponent } from './product-info.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductInfoComponent', () => {
  let component: ProductInfoComponent;
  let fixture: ComponentFixture<ProductInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductInfoComponent ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    component.addToBasket(currentProduct);
    let data = JSON.parse(localStorage.getItem('monosushi_basket') as string);
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBeTrue();
  });

});
