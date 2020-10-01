import { ItemDetailService } from './../../services/item-detail.service';
import { OrderDetail } from './../../models/order-detail';
import { ItemDetail } from './../../models/item-detail';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductService } from './../../services/product.service';
import { AppService } from 'src/app/services/app.service';
import { Product } from './../../models/product';
import { DetailSale } from './../../models/detail-sale';
import { ModalController, LoadingController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { ModalProductPage } from '../modal-product/modal-product.page';

@Component({
  selector: 'app-modal-detail',
  templateUrl: './modal-detail.page.html',
  styleUrls: ['./modal-detail.page.scss'],
})
export class ModalDetailPage implements OnInit {

  // Data passed in by detail
  @Input() id: string;

  // Data passed in by item-detail
  @Input() detail = {};
  @Input() idDetail: string;

  // works for both
  @Input() operation: string;

  public detailSale = {} as DetailSale;
  public detailOrder = {} as OrderDetail;
  public itemDetail = {} as ItemDetail

  public product = {} as Product;
  private loading: any;
  public tokenDetail: boolean = false;
  //private detailSaleId: any;

  private DetailSubscription: Subscription;
  private ProductSubscription: Subscription;
  //public contentOrderBy: DetailSale[];

  constructor(
    public modalCtrl: ModalController,
    //private detailSaleService: DetailSaleService,
    private appService: AppService,
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private readonly firestore: AngularFirestore,
    private itemDetailService: ItemDetailService
  ) { }

  ngOnInit() {

    if (this.idDetail) {
      //show data passed from detail
      this.itemDetail = this.detail;
      console.log(this.detail)
      this.getProductById();
    }

  }

  async presentModalProduct() {

    //show modal list products
    const modal = await this.modalCtrl.create({
      component: ModalProductPage,
      cssClass: 'my-custom-class'
    });

    await modal.present();

    //data receive the object from the modal list products
    const { data } = await modal.onDidDismiss();
    console.log("Return product data: ", data);

    this.itemDetail.idProduct = data.id;
    this.itemDetail.nameProduct = data.name;
    this.itemDetail.quantity = 0; //default quantity is 0
    this.itemDetail.price = data.sale_price;
    this.itemDetail.subtotal = data.sale_price;
    this.itemDetail.volume = data.volume;

    //info product extra
    this.product.image = data.image;
    this.product.quantity = data.quantity; //calculate stock
    this.product.purchase_price = data.purchase_price;
    this.product.category = data.category;
    this.product.created = data.created;
    this.product.timestamp = data.timestamp;

  }

  async getProductById() {
    this.ProductSubscription = (await this.productService.getProductById(this.itemDetail.idProduct)).valueChanges().subscribe(data => {
      this.product = data;
      this.product.quantity -= this.itemDetail.quantity;
    })
  }

  async saveDetail() {

    if (await this.formValidation()) {
      await this.presentLoading();

      //update
      if (this.idDetail) {

        if (this.operation == "sale") {
          //update detail sale
          try {
            this.firestore.collection("details-sale").doc(this.idDetail).set({
              idSale: this.id,
              idProduct: this.itemDetail.idProduct,
              nameProduct: this.itemDetail.nameProduct,
              quantity: this.itemDetail.quantity, //quantity detail updated
              price: this.itemDetail.price,
              volume: this.itemDetail.volume,
              subtotal: this.itemDetail.subtotal
            });
            this.loading.dismiss();
            this.modalCtrl.dismiss();
          } catch (error) {
            this.appService.presentToast(error);
            this.loading.dismiss();
            console.log(error);
          }
        }

        if (this.operation == "order") {
          //update detail order
          try {
            this.firestore.collection("details-order").doc(this.idDetail).set({
              idOrder: this.id,
              idProduct: this.itemDetail.idProduct,
              nameProduct: this.itemDetail.nameProduct,
              quantity: this.itemDetail.quantity, //quantity detail updated
              price: this.itemDetail.price,
              volume: this.itemDetail.volume,
              subtotal: this.itemDetail.subtotal
            });

            this.loading.dismiss();
            this.modalCtrl.dismiss();
          } catch (error) {
            this.appService.presentToast(error);
            this.loading.dismiss();
            console.log(error);
          }
        }

      } else {
        //create

        if (this.operation == "sale") {
          //create detail sale and discount stock product
          try {
            this.detailSale = this.itemDetail;
            this.detailSale.idSale = this.id;
            this.itemDetailService.addDetailSale(this.detailSale);

            this.firestore.collection("products").doc(this.itemDetail.idProduct).set({
              name: this.itemDetail.nameProduct,
              sale_price: this.itemDetail.price,
              purchase_price: this.product.purchase_price,
              category: this.product.category,
              volume: this.itemDetail.volume,
              quantity: this.product.quantity, //stock product updated
              created: this.product.created,
              timestamp: this.product.timestamp,
              image: this.product.image
            });

            //this.modalCtrl.dismiss(this.contentOrderBy); send data local, test
            this.loading.dismiss();
            this.modalCtrl.dismiss();
          } catch (error) {
            this.appService.presentToast(error);
            this.loading.dismiss();
            console.log(error);
          }
        }

        if (this.operation == "order") {
          //create detail order, not discount stock product
          try {
            this.detailOrder = this.itemDetail;
            this.detailOrder.idOrder = this.id;
            this.itemDetailService.addDetailOrder(this.detailOrder);
            //this.modalCtrl.dismiss(this.contentOrderBy); send data local, test
            this.loading.dismiss();
            this.modalCtrl.dismiss();
          } catch (error) {
            this.appService.presentToast(error);
            this.loading.dismiss();
            console.log(error);
          }
        }
      }
    }

  }

  async formValidation() {

    if (!this.itemDetail.idProduct) {
      this.appService.presentAlert("Ingrese un producto");
      return false;
    }
    if (this.itemDetail.quantity == 0) {
      this.appService.presentAlert("Ingrese una cantidad");
      return false;
    }
    return true;

  }

  decreaseQuantity() {

    if (this.itemDetail.quantity >= 1) {
      this.itemDetail.quantity -= 1;
      this.itemDetail.subtotal = this.itemDetail.price * this.itemDetail.quantity;
      this.product.quantity += 1;
    } else {
      return;
    }

  }

  increaseQuantity() {

    if (this.product.quantity != 0) {
      this.itemDetail.quantity += 1;
      this.itemDetail.subtotal = this.itemDetail.price * this.itemDetail.quantity;
      this.product.quantity -= 1;
    } else {
      return;
    }
  }

  async presentLoading() {

    this.loading = await this.loadingCtrl.create({ message: "Espere.." });
    return this.loading.present();

  }

  dismissModal() {

    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });

  }


}
