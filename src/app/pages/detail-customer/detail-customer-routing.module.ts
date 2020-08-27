import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailCustomerPage } from './detail-customer.page';

const routes: Routes = [
  {
    path: '',
    component: DetailCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailCustomerPageRoutingModule {}
