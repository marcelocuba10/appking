import { ModalDetailPageModule } from './../modal-detail/modal-detail.module';
import { ModalDetailPage } from './../modal-detail/modal-detail.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailSalePageRoutingModule } from './detail-sale-routing.module';

import { DetailSalePage } from './detail-sale.page';

@NgModule({
  entryComponents: [
    ModalDetailPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailSalePageRoutingModule,
    ModalDetailPageModule
  ],
  declarations: [DetailSalePage]
})
export class DetailSalePageModule { }
