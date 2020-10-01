import { ModalDetailPageModule } from './../modal-detail/modal-detail.module';
import { ModalDetailPage } from './../modal-detail/modal-detail.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';

import { IonicModule } from '@ionic/angular';

import { DetailOrderPageRoutingModule } from './detail-order-routing.module';

import { DetailOrderPage } from './detail-order.page';

@NgModule({
  entryComponents: [
    ModalDetailPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailOrderPageRoutingModule,
    ModalDetailPageModule,
    MbscModule, // add the mobiscroll module
  ],
  declarations: [DetailOrderPage]
})
export class DetailOrderPageModule { }
