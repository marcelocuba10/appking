import { Vendor } from './../../models/vendor';
import { VendorService } from 'src/app/services/vendor.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController } from '@ionic/angular';
import { AppService } from './../../services/app.service';
import { SaleService } from 'src/app/services/sale.service';
import { CustomerService } from './../../services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Sale } from '../../models/sale';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-sale',
  templateUrl: './detail-sale.page.html',
  styleUrls: ['./detail-sale.page.scss'],
})
export class DetailSalePage implements OnInit {
  private saleSubscription: Subscription;
  private customerSubscription: Subscription;
  private vendorSubscription: Subscription;
  private saleId: any;
  public sale = {} as Sale;
  public customers: any;
  public vendors: any;
  private loading: any;

  constructor(
    private actRoute: ActivatedRoute,
    private customerService: CustomerService,
    private saleService: SaleService,
    private appService: AppService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private vendorService: VendorService
  ) {
    this.saleId = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    if (this.saleId) {
      this.getSaleById();
    }

    this.getCustomers();
    this.getVendors();
  }

  async getSaleById() {
    this.saleSubscription = (await this.saleService.getSaleById(this.saleId)).subscribe(data => {
      this.sale = data;
    })
  }

  async saveSale() {
    await this.presentLoading();
    if (this.formValidation()) {
      this.sale.timestamp = Date.now();
      this.sale.date = moment().locale('es').format('L');

      for (let index = 0; index < this.vendors.length; index++) {
        if (this.vendors[index].id == this.sale.idVendor) {
          this.sale.nameVendor = this.vendors[index].name;
          break;
        }
      }

      for (let index = 0; index < this.customers.length; index++) {
        if (this.customers[index].id == this.sale.idCustomer) {
          this.sale.nameCustomer = this.customers[index].name;
          break;
        }
      }

      try {
        this.saleService.addSale(this.sale);
        this.loading.dismiss();
        this.navCtrl.navigateRoot("sales");

      } catch (error) {
        this.appService.presentToast(error);
        this.loading.dismiss();
      }
    }
  }

  async getCustomers() {
    try {
      this.customerSubscription = await this.firestore.collection("customers").snapshotChanges().subscribe(data => {
        this.customers = data.map(e => {
          return {
            id: e.payload.doc.id,
            name: e.payload.doc.data()["name"]
          }
        })
      })
    } catch (error) {
      this.appService.presentToast(error);
    }
  }

  async getVendors() {
    try {
      this.vendorSubscription = await this.firestore.collection("vendors").snapshotChanges().subscribe(data => {
        this.vendors = data.map(e => {
          return {
            id: e.payload.doc.id,
            name: e.payload.doc.data()["name"]
          }
        })
      })
    } catch (error) {
      this.appService.presentToast(error);
    }
  }

  async formValidation() {
    if (!this.sale.idCustomer) {
      this.appService.presentToast("Ingrese un Cliente");
      return false;
    }
    if (!this.sale.idVendor) {
      this.appService.presentToast("Ingrese un Vendedor");
      return false;
    }
    return true;
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: "Espere.." });
    return this.loading.present();
  }

  ngDestroy() {
    this.saleSubscription.unsubscribe();
    this.vendorSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
  }

}
