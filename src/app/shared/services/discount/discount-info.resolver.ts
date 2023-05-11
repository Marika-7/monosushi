import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DiscountService } from './discount.service';
import { IDiscountResponse } from '../../interfaces/discount/discount.interface';
import { DocumentData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DiscountInfoResolver implements Resolve<DocumentData> {

  constructor(
    private discountService: DiscountService
  ) {}
  
  // resolveFirebase(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DocumentData> {
  //   return this.discountService.getOneFirebase(route.paramMap.get('id'));
  // }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DocumentData> {
    return this.discountService.getOneFirebase(route.paramMap.get('id') as string);
  }
}
