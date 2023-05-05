import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountComponent } from './discount.component';
import { DiscountInfoComponent } from './discount-info/discount-info.component';
import { DiscountRoutingModule } from './discount-routing.module';

@NgModule({
  declarations: [
    DiscountComponent,
    DiscountInfoComponent
  ],
  imports: [
    CommonModule,
    DiscountRoutingModule
  ]
})
export class DiscountModule { }
