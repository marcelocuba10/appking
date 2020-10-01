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
        loadChildren: () => import('../pages/vendors/vendors.module').then(m => m.VendorsPageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('../pages/orders/orders.module').then(m => m.OrdersPageModule)
      },
      {
        path: 'sales',
        loadChildren: () => import('../pages/sales/sales.module').then(m => m.SalesPageModule)
      },
      {
        path: 'customer',
        loadChildren: () => import('../pages/customer/customer.module').then(m => m.CustomerPageModule)
      },
      {
        path: 'detail-product/:id',
        loadChildren: () => import('../pages/detail-product/detail-product.module').then(m => m.DetailProductPageModule)
      },
      {
        path: 'detail-product',
        loadChildren: () => import('../pages/detail-product/detail-product.module').then(m => m.DetailProductPageModule)
      },
      {
        path: 'detail-vendor/:id',
        loadChildren: () => import('../pages/detail-vendor/detail-vendor.module').then(m => m.DetailVendorPageModule)
      },
      {
        path: 'detail-vendor',
        loadChildren: () => import('../pages/detail-vendor/detail-vendor.module').then(m => m.DetailVendorPageModule)
      },
      {
        path: 'detail-customer/:id',
        loadChildren: () => import('../pages/detail-customer/detail-customer.module').then(m => m.DetailCustomerPageModule)
      },
      {
        path: 'detail-customer',
        loadChildren: () => import('../pages/detail-customer/detail-customer.module').then(m => m.DetailCustomerPageModule)
      },
      {
        path: 'detail-sale/:id',
        loadChildren: () => import('../pages/detail-sale/detail-sale.module').then(m => m.DetailSalePageModule)
      },
      {
        path: 'detail-sale',
        loadChildren: () => import('../pages/detail-sale/detail-sale.module').then(m => m.DetailSalePageModule)
      },
      {
        path: 'modal-detail/:id',
        loadChildren: () => import('../pages/modal-detail/modal-detail.module').then(m => m.ModalDetailPageModule)
      },
      {
        path: 'detail-order/:id',
        loadChildren: () => import('../pages/detail-order/detail-order.module').then(m => m.DetailOrderPageModule)
      },
      {
        path: 'detail-order',
        loadChildren: () => import('../pages/detail-order/detail-order.module').then(m => m.DetailOrderPageModule)
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
  },
  {
    path: 'detail-vendor',
    redirectTo: '/tabs/detail-vendor',
    pathMatch: 'full'
  },
  {
    path: 'detail-customer/:id',
    redirectTo: '/tabs/detail-customer/:id',
    pathMatch: 'full'
  },
  {
    path: 'detail-customer',
    redirectTo: '/tabs/detail-customer',
    pathMatch: 'full'
  },
  {
    path: 'detail-product/:id',
    redirectTo: '/tabs/detail-product/:id',
    pathMatch: 'full'
  },
  {
    path: 'detail-product',
    redirectTo: '/tabs/detail-product',
    pathMatch: 'full'
  },
  {
    path: 'detail-sale/:id',
    redirectTo: '/tabs/detail-sale/:id',
    pathMatch: 'full'
  },
  {
    path: 'detail-sale',
    redirectTo: '/tabs/detail-sale',
    pathMatch: 'full'
  },
  {
    path: 'modal-detail/:id',
    redirectTo: '/tabs/modal-detail/:id',
    pathMatch: 'full'
  },
  {
    path: 'detail-order/:id',
    redirectTo: '/tabs/detail-order/:id',
    pathMatch: 'full'
  },
  {
    path: 'detail-order',
    redirectTo: '/tabs/detail-order',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
