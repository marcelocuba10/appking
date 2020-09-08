import { ModalDetailPage } from './../modal-detail/modal-detail.page';
import { DetailSale } from './../../models/detail-sale';
import { Product } from './../../models/product';
import { ModalProductPage } from './../modal-product/modal-product.page';
import { Vendor } from './../../models/vendor';
import { VendorService } from 'src/app/services/vendor.service';
import { AngularFirestore, fromDocRef } from '@angular/fire/firestore';
import { LoadingController, NavController, ModalController } from '@ionic/angular';
import { AppService } from './../../services/app.service';
import { SaleService } from 'src/app/services/sale.service';
import { CustomerService } from './../../services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Sale } from '../../models/sale';
import * as moment from 'moment';
import { DetailSaleService } from 'src/app/services/detail-sale.service';

@Component({
  selector: 'app-detail-sale',
  templateUrl: './detail-sale.page.html',
  styleUrls: ['./detail-sale.page.scss'],
})
export class DetailSalePage implements OnInit {

  private saleSubscription: Subscription;
  private customerSubscription: Subscription;
  private vendorSubscription: Subscription;
  private detailSaleSubscription: Subscription;

  public saleId: any;
  //public newSaleId: number;
  public sale = {} as Sale;
  public product = {} as Product;
  public detailSale = {} as DetailSale;

  public customers: any;
  public vendors: any;
  private loading: any;
  public productId: any;
  public details = new Array<DetailSale>();

  public item_c: number = 0;
  public subtotal: number;
  public total: number;
  public detailId: string;

  constructor(
    private actRoute: ActivatedRoute,
    private customerService: CustomerService,
    private vendorService: VendorService,
    private saleService: SaleService,
    private appService: AppService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    public modalCtrl: ModalController,
    private detailSaleService: DetailSaleService
  ) {
    this.saleId = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    if (this.saleId) {
      //si tiene ID muestra datos
      this.getSaleById();
    }else{
      //nueva venta
      this.saleId = Date.now();
    }

    this.sale.date = moment().locale('es').format('L');

    this.getCustomers();
    this.getVendors();
    this.getDetailsSale();
  }

  async presentModalProduct() {

    const modal = await this.modalCtrl.create({
      component: ModalProductPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'saleId': this.saleId
      }
    });

    await modal.present();

    //la data es un objeto que me permitira trabajar la info que viene del modal hijo
    const { data } = await modal.onDidDismiss();
    console.log("Retorno del modal detail:", data);

      //por encuanto

  }

  async presentModalDetail() {

    const modal = await this.modalCtrl.create({
      component: ModalDetailPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'saleId': this.saleId
      }
    });

    await modal.present();

    //la data es un objeto que me permitira trabajar la info que viene del modal hijo
    const { data } = await modal.onDidDismiss();
    console.log("Retorno del modal:", data);

    this.sale.total = 2222;
  }

  decreaseQuantity() {
    if (this.detailSale.quantity <= 1) {
      return;
    }
    this.detailSale.quantity -= 1;
    this.detailSale.subtotal = this.detailSale.price * this.detailSale.quantity;
    this.sale.total = this.detailSale.subtotal;
  }

  increaseQuantity() {
    this.detailSale.quantity += 1;
    this.detailSale.subtotal = this.detailSale.price * this.detailSale.quantity;
    this.sale.total = this.detailSale.subtotal;
  }

  async getSaleById() {
    this.saleSubscription = (await this.saleService.getSaleById(this.saleId)).subscribe(data => {
      this.sale = data;
    })
  }

  async getDetailsSale() {

    console.log("id customer" + this.sale.idCustomer);

    // this.detailSaleSubscription = (await this.detailSaleService.getDetailsSale(this.saleId)).subscribe(data => {
    //   this.detailSale = data;
    // })

    try {
      this.detailSaleSubscription = this.firestore.collection("details-sale", ref => ref.where("idSale", "==", this.saleId)).snapshotChanges().subscribe(
        data => {
          this.details = data.map(e => {
            return {
              id: e.payload.doc.id,
              idSale: e.payload.doc.data()["idSale"],
              idProduct: e.payload.doc.data()["idProduct"],
              nameProduct: e.payload.doc.data()["nameProduct"],
              quantity: e.payload.doc.data()["quantity"],
              price: e.payload.doc.data()["price"],
              volume: e.payload.doc.data()["volume"],
              subtotal: e.payload.doc.data()["subtotal"],
            };
          });
        });
      console.log(this.saleId);
      //console.log(this.doc.id);
    } catch (error) {
      this.appService.presentToast(error);
    }
  }

  async saveSale() {
    if (await this.formValidation()) {

      await this.presentLoading();

      this.sale.timestamp = Date.now();
      this.sale.date = moment().locale('es').format('L');

      //search vendor name by vendorId
      for (let index = 0; index < this.vendors.length; index++) {
        if (this.vendors[index].id == this.sale.idVendor) {
          this.sale.nameVendor = this.vendors[index].name;
          break;
        }
      }

      //search customer name by customerId
      for (let index = 0; index < this.customers.length; index++) {
        if (this.customers[index].id == this.sale.idCustomer) {
          this.sale.nameCustomer = this.customers[index].name;
          break;
        }
      }

      try {
        if (this.sale.observation == null) {
          this.sale.observation = "";  //da error guardar campos null
        }
        //this.saleService.addSale(this.sale);

        console.log(this.saleId);
        this.firestore.collection("sales").doc(this.saleId.toString()).set({
          idCustomer: this.sale.idCustomer,
          nameCustomer: this.sale.nameCustomer,
          idVendor: this.sale.idVendor,
          nameVendor: this.sale.nameVendor,
          total: this.sale.total,
          date: this.sale.date,
          timestamp: Date.now(),
          observation: this.sale.observation
        });

        //this.saleService.addSale(this.sale);
        this.loading.dismiss();
        this.navCtrl.navigateRoot("sales");

      } catch (error) {
        this.appService.presentToast(error);
        this.loading.dismiss();
        console.log(error);
      }
    }
  }

  ConfirmDelete() {

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
      console.log("id customer" + this.sale.idCustomer);
    } catch (error) {
      this.appService.presentToast(error);
    }
    console.log("id customer" + this.sale.idCustomer);
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
    console.log("id customer" + this.sale.idCustomer);
  }

  async formValidation() {
    if (!this.sale.idCustomer) {
      this.appService.presentAlert("Ingrese un Cliente");
      return false;
    }
    if (!this.sale.idVendor) {
      this.appService.presentAlert("Ingrese un Vendedor");
      return false;
    }
    // if (!this.detailSale.idProduct) {
    //   this.appService.presentAlert("Ingrese un item para la venta");
    //   return false;
    // }
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
    this.detailSaleSubscription.unsubscribe();
  }

}
