import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnDestroy {

  public userProducts: IProductResponse[] = [];
  public nameOfPage = '';
  private eventSubscription!: Subscription;

  constructor (
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {
    this.eventSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadProducts();
      }
    })
  }

  loadProducts(): void {
    let categoryName = this.activatedRoute.snapshot.paramMap.get('category') as string;
    if (!categoryName) {
      categoryName = 'rolls';
    }
    this.productService.getAllByCategory(categoryName)
      .subscribe(data => {
        this.userProducts = data;
        this.nameOfPage = this.userProducts[0].category.name;
      });
  }

  openTab(event: any): void {
    let tabs = document.getElementsByClassName('tab__btn');
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active');      
    }
    event.target.classList.add('active');
  }

  productCount(product: IProductResponse, value: boolean): void {
    if (value) {
      ++product.count;
    } else if (!value && product.count > 1) {
      --product.count;
    }
  }

  addToBasket(product: IProductResponse): void {
    let basket: Array<IProductResponse> = [];
    if (localStorage.length > 0 && localStorage.getItem('monosushi_basket')) {
      basket = JSON.parse(localStorage.getItem('monosushi_basket') as string);
      if ( basket.some(prod => prod.id === product.id)) {
        const index = basket.findIndex(prod => prod.id === product.id);
        basket[index].count += product.count;
      } else {
        basket.push(product);
      }
    } else {
      basket.push(product);
    }
    localStorage.setItem('monosushi_basket', JSON.stringify(basket));
    product.count = 1;
    this.orderService.changeBasket.next(true);
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

}
