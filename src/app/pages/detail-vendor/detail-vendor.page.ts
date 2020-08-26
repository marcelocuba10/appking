import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { VendorService } from 'src/app/services/vendor.service';
import { Vendor } from "../../models/vendor";
import { LoadingController, NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-vendor',
  templateUrl: './detail-vendor.page.html',
  styleUrls: ['./detail-vendor.page.scss'],
})
export class DetailVendorPage implements OnInit {
  private vendorId: any;
  private vendorSubscription: Subscription;
  private vendor = {} as Vendor;
  private loading: any;

  constructor(
    private actRoute: ActivatedRoute,
    private vendorService: VendorService,
    private loadingCtrl: LoadingController,
    private appService: AppService,
    private navCtrl: NavController
  ) {
    //captura el ID
    this.vendorId = this.actRoute.snapshot.paramMap.get("id");
    console.log(this.vendorId);
  }

  ngOnInit() {
    if (this.vendorId) {
      this.getVendorById();
    }
  }

  async getVendorById() {
    this.vendorSubscription = (await this.vendorService.getVendorById(this.vendorId)).valueChanges().subscribe(
      data => {
        this.vendor.name = data["name"];
        this.vendor.lastName = data["lastName"];
        this.vendor.phone = data["phone"];
        this.vendor.address = data["address"];
        this.vendor.created = data["created"];
      })
  }

  async saveVendor() {

    await this.presentLoading();

    if (this.formValidation()) {

      this.vendor.created = moment().locale('es').format('L');
      this.vendor.timestamp = Date.now();

      if (this.vendorId) {
        //update product
        console.log(this.vendorId);
        try {
          await this.vendorService.updateVendor(this.vendorId, this.vendor);
          this.loading.dismiss();
          this.navCtrl.navigateRoot("/vendors");

        } catch (error) {
          this.appService.presentToast(error);
          this.loading.dismiss();
        }

      } else {
        //create product
        try {
          await this.vendorService.addVendor(this.vendor);
          this.loading.dismiss();
          this.navCtrl.navigateRoot("/vendors");

        } catch (error) {
          this.appService.presentToast(error);
          this.loading.dismiss();
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.vendorSubscription) this.vendorSubscription.unsubscribe();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Por favor, espere.."
    });
    return this.loading.present();
  }

  formValidation() {
    if (!this.vendor.name) {
      this.appService.presentToast("Ingrese nombre");
      this.loading.dismiss();
      return false;
    }

    if (!this.vendor.lastName) {
      this.appService.presentToast("Ingrese apellidos");
      this.loading.dismiss();
      return false;
    }

    if (!this.vendor.phone) {
      this.appService.presentToast("Ingrese telefono");
      this.loading.dismiss();
      return false;
    }

    if (!this.vendor.address) {
      this.appService.presentToast("Ingrese direccion");
      this.loading.dismiss();
      return false;
    }
    return true;
  }

}
