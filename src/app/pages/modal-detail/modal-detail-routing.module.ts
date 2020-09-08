import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalDetailPage } from './modal-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ModalDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDetailPageRoutingModule {}
