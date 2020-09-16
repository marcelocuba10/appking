import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'detail-product/:id',
    loadChildren: () => import('./pages/detail-product/detail-product.module').then( m => m.DetailProductPageModule)
  },
  {
    path: 'detail-product',
    loadChildren: () => import('./pages/detail-product/detail-product.module').then( m => m.DetailProductPageModule)
  },
  {
    path: 'vendors',
    loadChildren: () => import('./pages/vendors/vendors.module').then( m => m.VendorsPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'sales',
    loadChildren: () => import('./pages/sales/sales.module').then( m => m.SalesPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./pages/customer/customer.module').then( m => m.CustomerPageModule)
  },
  {
    path: 'detail-vendor',
    loadChildren: () => import('./pages/detail-vendor/detail-vendor.module').then( m => m.DetailVendorPageModule)
  },
  {
    path: 'detail-vendor/:id',
    loadChildren: () => import('./pages/detail-vendor/detail-vendor.module').then( m => m.DetailVendorPageModule)
  },
  {
    path: 'detail-customer',
    loadChildren: () => import('./pages/detail-customer/detail-customer.module').then( m => m.DetailCustomerPageModule)
  },
  {
    path: 'detail-customer/:id',
    loadChildren: () => import('./pages/detail-customer/detail-customer.module').then( m => m.DetailCustomerPageModule)
  },
  {
    path: 'detail-sale',
    loadChildren: () => import('./pages/detail-sale/detail-sale.module').then( m => m.DetailSalePageModule)
  },
  {
    path: 'modal-product',
    loadChildren: () => import('./pages/modal-product/modal-product.module').then( m => m.ModalProductPageModule)
  },
  {
    path: 'modal-detail',
    loadChildren: () => import('./pages/modal-detail/modal-detail.module').then( m => m.ModalDetailPageModule)
  },
  {
    path: 'modal-detail/:id',
    loadChildren: () => import('./pages/modal-detail/modal-detail.module').then( m => m.ModalDetailPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
