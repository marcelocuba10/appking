import { ItemDetailService } from './../../services/item-detail.service';
import { Customer } from './../../models/customer';
import { ModalDetailPage } from './../modal-detail/modal-detail.page';
import { DetailSale } from './../../models/detail-sale';
import { Product } from './../../models/product';
import { Vendor } from './../../models/vendor';
import { VendorService } from 'src/app/services/vendor.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController, ModalController, AlertController } from '@ionic/angular';
import { AppService } from './../../services/app.service';
import { SaleService } from 'src/app/services/sale.service';
import { CustomerService } from './../../services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Sale } from '../../models/sale';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

@Component({
  selector: 'app-detail-sale',
  templateUrl: './detail-sale.page.html',
  styleUrls: ['./detail-sale.page.scss'],
})
export class DetailSalePage implements OnInit {

  public details = new Array<DetailSale>();
  public sale = {} as Sale;
  public product = {} as Product;
  private customer = {} as Customer;
  private vendor = {} as Vendor;

  private detailSaleSubscription: Subscription;
  private saleSubscription: Subscription;
  private customerSubscription: Subscription;
  private vendorSubscription: Subscription;

  public customers: any;
  public saleId: any;
  public productId: any;
  public vendors: any;
  private loading: any;
  private isExisting: boolean;

  constructor(
    private actRoute: ActivatedRoute,
    private customerService: CustomerService,
    private vendorService: VendorService,
    private saleService: SaleService,
    private appService: AppService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private readonly firestore: AngularFirestore,
    public modalCtrl: ModalController,
    private ItemDetailService: ItemDetailService
  ) {
    this.saleId = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {

    if (this.saleId) {
      //show data sale existing
      this.getSaleById();
      this.getDetailsSale();
      this.isExisting = true;
    } else {
      //new sale
      this.saleId = this.firestore.createId();
      this.getVendors();
      this.getCustomers();
      this.isExisting = false;
    }

    this.sale.date = moment().locale('es').format('L');

  }

  async presentModalDetail() {

    const modal = await this.modalCtrl.create({
      component: ModalDetailPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'id': this.saleId,
        'operation': "sale"
      }
    });

    await modal.present();

    //the data is an object that will allow me to work the info that comes from the modal-detail
    const { data } = await modal.onDidDismiss();
    //console.log("Return detail data: ", data); test
    this.getDetailsSale();

  }

  async presentModalDetailEdit(detail: DetailSale, id: string) {

    const modal = await this.modalCtrl.create({
      component: ModalDetailPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'id': this.saleId,
        'operation': "sale",
        'detail': detail,
        'idDetail': id
      }
    });

    await modal.present();

    //the data is an object that will allow me to work the info that comes from the modal-detail
    const { data } = await modal.onDidDismiss();
    //console.log("Return detail data: ", data); test
    this.getDetailsSale();

  }

  async undoSale(){

    if (this.isExisting) {
      return;
    } else {
      let fs = firebase.firestore();
      let collectionRef = fs.collection("details-sale");

      collectionRef.where("idSale", "==", this.saleId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete().then(() => {
              console.log("Document successfully deleted!");
            }).catch(function (error) {
              console.error("Error removing document: ", error);
            });
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }

  }

  async getSaleById() {

    this.saleSubscription = (await this.saleService.getSaleById(this.saleId)).subscribe(data => {
      this.sale = data;
    })

  }

  async getDetailsSale() {

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
            subtotal: e.payload.doc.data()["subtotal"]
          };
        });

        let initialValue = 0;
        this.sale.total = this.details.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue.subtotal
        }, initialValue)
      });

  }

  async saveSale() {

    if (await this.formValidation() && this.getCustomerById() && this.getVendorById()) {
      await this.presentLoading();
      this.sale.timestamp = Date.now();
      this.sale.date = moment().locale('es').format('L');

      //old process
      // //search vendor name by vendorId
      // for (let index = 0; index < this.details.length; index++) {
      //   if (this.details[index].idSale == this.saleId) {
      //     this.sale.total = this.details[index].subtotal;
      //     break;
      //   }
      // }
      //search customer name by customerId
      // for (let index = 0; index < this.customers.length; index++) {
      //   if (this.customers[index].id == this.sale.idCustomer) {
      //     this.sale.nameCustomer = this.customers[index].name;
      //     break;
      //   }
      // }

      try {
        if (this.sale.observation == null) {
          this.sale.observation = "";  //null error
        }

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

  async getCustomerById() {

    try {
      this.customerSubscription = (await this.customerService.getCustomerByIdAux(this.sale.idCustomer)).subscribe(data => {
        this.customer = data;
        this.sale.nameCustomer = this.customer.name;
        console.log(this.sale.nameCustomer)
        return true;
      })
    } catch (error) {
      this.appService.presentToast(error);
      console.log(error);
    }

  }

  async getVendorById() {

    try {
      this.customerSubscription = (await this.vendorService.getVendorByIdAux(this.sale.idVendor)).subscribe(data => {
        this.vendor = data;
        this.sale.nameVendor = this.vendor.name;
        console.log(this.sale.nameVendor)
        return true;
      })
    } catch (error) {
      this.appService.presentToast(error);
      console.log(error);
    }

  }

  async ConfirmDeleteDetail(id: string) {

    try {
      await this.ItemDetailService.deleteDetailSale(id);
    } catch (error) {
      this.appService.presentToast(error);
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
      console.log(error);
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
      console.log(error);
    }

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
    if (this.details.length == 0) {
      this.appService.presentAlert("Ingrese un item para la venta");
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
    this.detailSaleSubscription.unsubscribe();

  }


}
