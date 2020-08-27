import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { LoadingController, NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.page.html',
  styleUrls: ['./detail-customer.page.scss'],
})
export class DetailCustomerPage implements OnInit {
  private customerId: any;
  private customerSubscription: Subscription;
  private customer = {} as Customer;
  private loading: any;

  constructor(
    private actRoute: ActivatedRoute,
    private customerService: CustomerService,
    private loadingCtrl: LoadingController,
    private appService: AppService,
    private navCtrl: NavController
  ) {
    this.customerId = this.actRoute.snapshot.paramMap.get("id");
    console.log(this.customerId);
  }

  ngOnInit() {
    if (this.customerId) {
      this.getCustomerById();
    }
  }

  async getCustomerById() {
    this.customerSubscription = (await this.customerService.getCustomerById(this.customerId)).valueChanges().subscribe(
      data => {
        this.customer.name = data["name"];
        this.customer.phone = data["phone"];
        this.customer.address = data["address"];
        this.customer.ruc = data["ruc"];
        this.customer.salesman = data["salesman"];
        this.customer.created = data["created"];
      })
  }

  async saveCustomer() {

    await this.presentLoading();

    if (this.formValidation()) {

      this.customer.created = moment().format('L');
      this.customer.timestamp = Date.now();

      if (this.customerId) {
        //update product
        console.log(this.customerId);
        try {
          await this.customerService.updateCustomer(this.customerId, this.customer);
          this.loading.dismiss();
          this.navCtrl.navigateRoot("/customer");

        } catch (error) {
          this.appService.presentToast(error);
          this.loading.dismiss();
        }

      } else {
        //create product
        try {
          await this.customerService.addCustomer(this.customer);
          this.loading.dismiss();
          this.navCtrl.navigateRoot("/customer");

        } catch (error) {
          this.appService.presentToast(error);
          this.loading.dismiss();
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.customerSubscription) this.customerSubscription.unsubscribe();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Por favor, espere.."
    });
    return this.loading.present();
  }

  formValidation() {
    if (!this.customer.name) {
      this.appService.presentToast("Ingrese nombre");
      this.loading.dismiss();
      return false;
    }

    if (!this.customer.phone) {
      this.appService.presentToast("Ingrese telefono");
      this.loading.dismiss();
      return false;
    }

    if (!this.customer.address) {
      this.appService.presentToast("Ingrese direccion");
      this.loading.dismiss();
      return false;
    }
    return true;
  }

}
