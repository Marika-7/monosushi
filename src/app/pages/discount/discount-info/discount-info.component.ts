import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDiscountResponse } from 'src/app/shared/interfaces/discount/discount.interface';

@Component({
  selector: 'app-discount-info',
  templateUrl: './discount-info.component.html',
  styleUrls: ['./discount-info.component.scss']
})
export class DiscountInfoComponent implements OnInit {

  public currentDiscount!: IDiscountResponse;
  public list!: Array<string>;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.currentDiscount = response['discountInfo'];
    });
    this.createList();
  }

  createList(): void {
    if (this.currentDiscount) {
      this.list = this.currentDiscount.description.split('\n');
    }
  }

}
