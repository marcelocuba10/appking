import { ProductPageModule } from './../product/product.module';
import { ProductPage } from './../product/product.page';
import { ModalProductPageModule } from './../modal-product/modal-product.module';
import { ModalProductPage } from './../modal-product/modal-product.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailSalePageRoutingModule } from './detail-sale-routing.module';

import { DetailSalePage } from './detail-sale.page';

@NgModule({
  entryComponents:[
    ModalProductPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailSalePageRoutingModule,
    ModalProductPageModule
  ],
  declarations: [DetailSalePage]
})
export class DetailSalePageModule {}
