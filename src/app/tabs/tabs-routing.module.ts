import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'product',
        loadChildren: () => import('../pages/product/product.module').then(m => m.ProductPageModule)
      },
      {
        path: 'vendors',
        loadChildren: () => import('../pages/vendors/vendors.module').then( m => m.VendorsPageModule)
      },
      {
        path: 'detail-product/:id',
        loadChildren: () => import('../pages/detail-product/detail-product.module').then( m => m.DetailProductPageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('../pages/orders/orders.module').then( m => m.OrdersPageModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('../pages/sales/sales.module').then( m => m.SalesPageModule)
      },
      {
        path: 'customer',
        loadChildren: () => import('../pages/customer/customer.module').then( m => m.CustomerPageModule)
      },
      {
        path: 'detail-vendor/:id',
        loadChildren: () => import('../pages/detail-vendor/detail-vendor.module').then( m => m.DetailVendorPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'customer',
    redirectTo: '/tabs/customer',
    pathMatch: 'full'
  },
  {
    path: 'product',
    redirectTo: '/tabs/product',
    pathMatch: 'full'
  },
  {
    path: 'detail-product/:id',
    redirectTo: '/tabs/detail-product/:id',
    pathMatch: 'full'
  },
  {
    path: 'vendors',
    redirectTo: '/tabs/vendors',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    redirectTo: '/tabs/orders',
    pathMatch: 'full'
  },
  {
    path: 'sales',
    redirectTo: '/tabs/sales',
    pathMatch: 'full'
  },
  {
    path: 'detail-vendor/:id',
    redirectTo: '/tabs/detail-vendor/:id',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
