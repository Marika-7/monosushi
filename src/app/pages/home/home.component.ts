import { Component } from '@angular/core';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  
  public isOpenDetails = false;

  toggleDetails(): void {
    this.isOpenDetails = !this.isOpenDetails;
  }

}
