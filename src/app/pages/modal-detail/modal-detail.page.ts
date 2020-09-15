import { AngularFirestore } from '@angular/fire/firestore';
import { ProductService } from './../../services/product.service';
import { AppService } from 'src/app/services/app.service';
import { DetailSaleService } from 'src/app/services/detail-sale.service';
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

  @Input() saleId: string;
  public detailSale = {} as DetailSale;
  public product = {} as Product;
  private loading: any;
  public tokenDetail: boolean = false;
  //public contentOrderBy: DetailSale[];

  constructor(
    public modalCtrl: ModalController,
    private detailSaleService: DetailSaleService,
    private appService: AppService,
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private readonly firestore: AngularFirestore
  ) { }

  ngOnInit() {
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

    this.detailSale.idProduct = data.id;
    this.detailSale.nameProduct = data.name;
    this.detailSale.quantity = 0; //default quantity is 0
    this.detailSale.price = data.sale_price;
    this.detailSale.subtotal = data.sale_price;
    this.detailSale.volume = data.volume;

    //info product extra
    this.product.purchase_price = data.purchase_price;
    this.product.category = data.category;
    this.product.quantity = data.quantity; //calculate stock
    this.product.created = data.created;
    this.product.timestamp = data.timestamp;
    this.product.image = data.image;

    //test
    // this.contentOrderBy = [{
    //   idSale: this.saleId.toString(),
    //   idProduct: data.id,
    //   nameProduct: data.name,
    //   quantity: 1,
    //   price: data.sale_price,
    //   subtotal: data.sale_price,
    //   volume: data.volume
    // }]

  }

  async saveDetailSale() {

    if (await this.formValidation()) {
      await this.presentLoading();
      //add detail-sale
      try {

        this.detailSale.idSale = this.saleId.toString();
        console.log(this.saleId)
        this.detailSaleService.addDetailsSale(this.detailSale);

        this.firestore.collection("products").doc(this.detailSale.idProduct).set({
          name: this.detailSale.nameProduct,
          sale_price: this.detailSale.price,
          purchase_price: this.product.purchase_price,
          category: this.product.category,
          volume: this.detailSale.volume,
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

  }

  dismissModal() {

    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });

  }

  async formValidation() {

    if (!this.detailSale.idProduct) {
      this.appService.presentAlert("Ingrese un producto");
      return false;
    }
    return true;

  }

  async presentLoading() {

    this.loading = await this.loadingCtrl.create({ message: "Espere.." });
    return this.loading.present();

  }

  decreaseQuantity() {

    if (this.detailSale.quantity >= 1) {
      this.detailSale.quantity -= 1;
      this.detailSale.subtotal = this.detailSale.price * this.detailSale.quantity;
      this.product.quantity += 1;
      console.log(this.detailSale.quantity);
    } else {
      return;
    }

  }

  increaseQuantity() {

    this.detailSale.quantity += 1;
    this.detailSale.subtotal = this.detailSale.price * this.detailSale.quantity;
    this.product.quantity -= 1;

  }


}
