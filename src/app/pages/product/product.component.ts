import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  public userProducts: IProductResponse[] = [];

  constructor (
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getAll()
      .subscribe(data => {
        this.userProducts = data;
      })
  }

  openTab(event: any): void {
    let tabs = document.getElementsByClassName('tab__btn');
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active');      
    }
    event.target.classList.add('active');
  }

}
