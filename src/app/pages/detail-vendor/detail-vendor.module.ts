import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailVendorPageRoutingModule } from './detail-vendor-routing.module';

import { DetailVendorPage } from './detail-vendor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailVendorPageRoutingModule
  ],
  declarations: [DetailVendorPage]
})
export class DetailVendorPageModule {}
