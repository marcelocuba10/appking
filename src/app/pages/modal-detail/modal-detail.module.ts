import { ModalProductPage } from './../modal-product/modal-product.page';
import { ModalProductPageModule } from './../modal-product/modal-product.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalDetailPageRoutingModule } from './modal-detail-routing.module';

import { ModalDetailPage } from './modal-detail.page';

@NgModule({
  entryComponents:[
    ModalProductPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalDetailPageRoutingModule,
    ModalProductPageModule
  ],
  declarations: [ModalDetailPage]
})
export class ModalDetailPageModule {}
