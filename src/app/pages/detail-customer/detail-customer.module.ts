import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailCustomerPageRoutingModule } from './detail-customer-routing.module';

import { DetailCustomerPage } from './detail-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailCustomerPageRoutingModule
  ],
  declarations: [DetailCustomerPage]
})
export class DetailCustomerPageModule {}
