import { ProductService } from './../../services/product.service';
import { ItemDetailService } from './../../services/item-detail.service';
import { ModalDetailPage } from './../modal-detail/modal-detail.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController, ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { OrderService } from './../../services/order.service';
import { VendorService } from 'src/app/services/vendor.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Vendor } from 'src/app/models/vendor';
import { Customer } from 'src/app/models/customer';
import { Product } from 'src/app/models/product';
import { Order } from './../../models/order';
import { Component, OnInit } from '@angular/core';
import { OrderDetail } from '../../models/order-detail';
import * as moment from 'moment';
import * as firebase from 'firebase';
// import { fsync } from 'fs';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.page.html',
  styleUrls: ['./detail-order.page.scss'],
})
export class DetailOrderPage implements OnInit {
  public details = new Array<OrderDetail>();
  public products = new Array<Product>();

  public order = {} as Order;
  //private product = {} as Product;
  private customer = {} as Customer;
  private vendor = {} as Vendor;

  private detailOrderSubscription: Subscription;
  private orderSubscription: Subscription;
  private customerSubscription: Subscription;
  private vendorSubscription: Subscription;
  private productSubscription: Subscription;

  public customers: any;
  public idOrder: any;
  private productId: any;
  public vendors: any;
  private loading: any;
  private stockProduct: number;
  private quantityProduct: number;

  public btnActions: boolean;
  public actionTitle: string;
  public btnCancelled: boolean;
  public btnItem: boolean;
  public btnSave: boolean;
  public observation: boolean = false;
  private isExisting: boolean;

  constructor(
    private actRoute: ActivatedRoute,
    private customerService: CustomerService,
    private vendorService: VendorService,
    private orderService: OrderService,
    private appService: AppService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private readonly firestore: AngularFirestore,
    public modalCtrl: ModalController,
    private ItemDetailService: ItemDetailService,
    private productService: ProductService
  ) {
    this.idOrder = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {

    if (this.idOrder) {
      //show data order existing
      this.getOrderById();
      this.getDetailsOrder();

      //to remove item detail if the operation is exited
      this.isExisting = true;
      this.observation = false;

    } else {
      //new order
      this.idOrder = this.firestore.createId();
      this.getVendors();
      this.getCustomers();

      this.order.status = "Pendiente";
      this.btnActions = false;
      this.btnSave = false;
      this.btnCancelled = true;
      this.actionTitle = "Agregar Item";
      this.observation = true;

      this.order.date = moment().locale('es').format('L');

      //to remove item detail if the operation is exited
      this.isExisting = false;
    }

  }

  async addOrProcess() {

    if (this.actionTitle == "Procesar Pedido") {
      this.processOrder();
    } else {
      //present Modal Detail
      const modal = await this.modalCtrl.create({
        component: ModalDetailPage,
        cssClass: 'my-custom-class',
        componentProps: {
          'id': this.idOrder,
          'operation': "order"
        }
      });

      await modal.present();

      //the data is an object that will allow me to work the info that comes from the modal-detail
      const { data } = await modal.onDidDismiss();
      //console.log("Return detail data: ", data); test
      this.getDetailsOrder();
    }

  }

  async presentModalDetailEdit(detail: OrderDetail, id: string) {

    const modal = await this.modalCtrl.create({
      component: ModalDetailPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'id': this.idOrder,
        'operation': "order",
        'detail': detail,
        'idDetail': id
      }
    });

    await modal.present();

    //the data is an object that will allow me to work the info that comes from the modal-detail
    const { data } = await modal.onDidDismiss();
    //console.log("Return detail data: ", data); test
    this.getDetailsOrder();

  }

  async getOrderById() {

    this.orderSubscription = (await this.orderService.getOrderById(this.idOrder)).subscribe(data => {
      this.order = data;

      if (this.order.status == "Pendiente") {
        this.actionTitle = "Procesar Pedido";
        this.btnActions = false;
        this.btnSave = true;
        this.btnItem = true;
      }
      if (this.order.status == "Entregado") {
        this.actionTitle = "Procesar Pedido";
        this.btnActions = true;
        this.btnCancelled = true;
        this.btnItem = true;
        this.btnSave = true;
      }
      if (this.order.status == "Cancelado") {
        this.actionTitle = "Procesar Pedido";
        this.btnActions = true;
        this.btnCancelled = true;
        this.btnItem = true;
        this.btnSave = true;
      }
    });

  }

  async cancelOrder() {

    this.order.status = "Cancelado";
    this.observation = true; //enable the observation box
    this.btnSave = false;

  }

  async processOrder() {

    this.order.status = "Entregado";
    this.btnSave = false;

  }

  async undoOrder() {

    if (this.isExisting) {
      return;
    } else {
      let fs = firebase.firestore();
      let collectionRef = fs.collection("details-order");

      collectionRef.where("idOrder", "==", this.idOrder)
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

  async getDetailsOrder() {

    this.detailOrderSubscription = this.firestore.collection("details-order", ref => ref.where("idOrder", "==", this.idOrder)).snapshotChanges().subscribe(
      data => {
        this.details = data.map(e => {
          return {
            id: e.payload.doc.id,
            idOrder: e.payload.doc.data()["idOrder"],
            idProduct: e.payload.doc.data()["idProduct"],
            nameProduct: e.payload.doc.data()["nameProduct"],
            quantity: e.payload.doc.data()["quantity"],
            price: e.payload.doc.data()["price"],
            volume: e.payload.doc.data()["volume"],
            subtotal: e.payload.doc.data()["subtotal"]
          };
        });

        let initialValue = 0;
        this.order.total = this.details.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue.subtotal
        }, initialValue)
      });

  }

  async discountProduct() {
    //while idOrder in detail == idOrder, discount product producti.quantity - detail.quantity
    let fs = firebase.firestore();
    let c = 1;

    let collectionRef = fs.collection("details-order");
    //let collectionRefproduct = fs.collection("products");
    collectionRef.where("idOrder", "==", this.idOrder)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(async (doc) => {

          this.productId = doc.data()["idProduct"] //for search
          this.quantityProduct = doc.data()["quantity"] //for discount


          //search ID product
          this.productSubscription = (await this.productService.getProductByIdV(this.productId)).subscribe(data => {
            this.stockProduct = data["quantity"];

            if (c == 1) {
              c++;
              this.firestore.collection("products").doc(this.productId).set({

                name: data["name"],
                category: data["category"],
                created: data["created"],
                purchase_price: data["purchase_price"],
                sale_price: data["sale_price"],
                volume: data["volume"],
                image: data["image"],
                timestamp: data["timestamp"],
                quantity: this.stockProduct - this.quantityProduct
              });

              console.log("stock: " + this.stockProduct);
              console.log("quantity: " + this.quantityProduct);
            }

            console.log("out if");
          });

          console.log("out search idproduct");
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });

    return;

  }

  async saveOrder() {

    if (await this.formValidation() && this.getCustomerById() && this.getVendorById()) {
      await this.presentLoading();
      this.order.timestamp = Date.now();
      this.order.date = moment().locale('es').format('L');

      try {
        if (this.order.observation == null) {
          this.order.observation = "";  //null error
        }

        if (this.order.status == "Entregado") {
          this.discountProduct();
        }

        this.firestore.collection("orders").doc(this.idOrder.toString()).set({
          idCustomer: this.order.idCustomer,
          nameCustomer: this.order.nameCustomer,
          idVendor: this.order.idVendor,
          nameVendor: this.order.nameVendor,
          total: this.order.total,
          date: this.order.date,
          status: this.order.status,
          timestamp: Date.now(),
          observation: this.order.observation
        });

        this.loading.dismiss();
        this.appService.presentToast("Pedido Procesado con Exito!")
        this.navCtrl.navigateRoot("orders");
      } catch (error) {
        this.appService.presentToast(error);
        this.loading.dismiss();
        console.log(error);
      }
    }

  }

  async getCustomerById() {

    try {
      this.customerSubscription = (await this.customerService.getCustomerByIdAux(this.order.idCustomer)).subscribe(data => {
        this.customer = data;
        this.order.nameCustomer = this.customer.name;
        console.log(this.order.nameCustomer)
        return true;
      })
    } catch (error) {
      this.appService.presentToast(error);
      console.log(error);
    }

  }

  async getVendorById() {

    try {
      this.customerSubscription = (await this.vendorService.getVendorByIdAux(this.order.idVendor)).subscribe(data => {
        this.vendor = data;
        this.order.nameVendor = this.vendor.name;
        console.log(this.order.nameVendor)
        return true;
      })
    } catch (error) {
      this.appService.presentToast(error);
      console.log(error);
    }

  }

  async ConfirmDeleteDetail(id: string) {

    try {
      await this.ItemDetailService.deleteDetailOrder(id);
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

    if (!this.order.idCustomer) {
      this.appService.presentAlert("Ingrese un Cliente");
      return false;
    }
    if (!this.order.idVendor) {
      this.appService.presentAlert("Ingrese un Vendedor");
      return false;
    }
    if (this.details.length == 0) {
      this.appService.presentAlert("Ingrese un item para el pedido");
      return false;
    }
    return true;

  }

  async presentLoading() {

    this.loading = await this.loadingCtrl.create({ message: "Espere.." });
    return this.loading.present();

  }

  ngDestroy() {

    this.orderSubscription.unsubscribe();
    this.vendorSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
    this.detailOrderSubscription.unsubscribe();
    this.productSubscription.unsubscribe();

  }

}
