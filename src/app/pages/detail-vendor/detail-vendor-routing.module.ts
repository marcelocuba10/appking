import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailVendorPage } from './detail-vendor.page';

const routes: Routes = [
  {
    path: '',
    component: DetailVendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailVendorPageRoutingModule {}
