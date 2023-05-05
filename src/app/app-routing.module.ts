import { NgModule } from '@angular/core';
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'discount', 
    loadChildren: () => import('./pages/discount/discount.module').then(n => n.DiscountModule)
  },
  { 
    path: 'product', 
    loadChildren: () => import('./pages/product/product.module').then(n => n.ProductModule)
  },
  { 
    path: 'delivery', 
    loadChildren: () => import('./pages/delivery/delivery.module').then(n => n.DeliveryModule)
  },
  { 
    path: 'about', 
    loadChildren: () => import('./pages/about/about.module').then(n => n.AboutModule)
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./pages/authorization/authorization.module').then(n => n.AuthorizationModule)
  },
  { 
    path: 'cabinet', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/cabinet/cabinet.module').then(n => n.CabinetModule)
  },
  { 
    path: 'admin', 
    canActivate: [AuthGuard], 
    loadChildren: () => import('./admin/admin.module').then(n => n.AdminModule)
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
