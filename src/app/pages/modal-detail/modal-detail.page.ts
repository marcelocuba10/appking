import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
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
  // Data passed in by modal-detail
  @Input() saleId: string;
  @Input() detail = {} as DetailSale;
  @Input() detailId: string;

  public detailSale = {} as DetailSale;
  public product = {} as Product;
  private loading: any;
  public tokenDetail: boolean = false;
  private detailSaleId: any;

  private DetailSubscription: Subscription;
  private ProductSubscription: Subscription;
  //public contentOrderBy: DetailSale[];

  constructor(
    public modalCtrl: ModalController,
    private detailSaleService: DetailSaleService,
    private appService: AppService,
    private loadingCtrl: LoadingController,
    private productService: ProductService,
    private readonly firestore: AngularFirestore,
    private actRoute: ActivatedRoute
  ) {
    //this.detailSaleId = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {

    if (this.detailId) {
      //show data detail
      this.detailSale = this.detail;
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

    this.detailSale.idProduct = data.id;
    this.detailSale.nameProduct = data.name;
    this.detailSale.quantity = 0; //default quantity is 0
    this.detailSale.price = data.sale_price;
    this.detailSale.subtotal = data.sale_price;
    this.detailSale.volume = data.volume;

    //info product extra
    this.product.image = data.image;
    this.product.quantity = data.quantity; //calculate stock
    this.product.purchase_price = data.purchase_price;
    this.product.category = data.category;
    this.product.created = data.created;
    this.product.timestamp = data.timestamp;

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

  async getProductById() {
    this.ProductSubscription = (await this.productService.getProductById(this.detail.idProduct)).valueChanges().subscribe(data => {
      this.product = data;
    })
  }

  async saveDetailSale() {

    if (await this.formValidation()) {
      await this.presentLoading();

      //add detail-sale
      if (this.detailId) {
        //update detail
        try {
          //this.detailSaleService.updateDetail(this.detailSaleId, this.detailSale);
          this.firestore.collection("details-sale").doc(this.detailId).set({
            idSale: this.saleId,
            idProduct: this.detailSale.idProduct,
            nameProduct: this.detailSale.nameProduct,
            quantity: this.detailSale.quantity, //quantity detail updated
            price: this.detailSale.price,
            volume: this.detailSale.volume,
            subtotal: this.detailSale.subtotal
          });

          this.loading.dismiss();
          this.modalCtrl.dismiss();
        } catch (error) {
          this.appService.presentToast(error);
          this.loading.dismiss();
          console.log(error);
        }
      } else {
        //create detail
        try {
          this.detailSale.idSale = this.saleId;
          this.detailSaleService.addDetail(this.detailSale);

          //discount stock product
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
    if (this.detailSale.quantity == 0) {
      this.appService.presentAlert("Ingrese una cantidad");
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
    } else {
      return;
    }

  }

  increaseQuantity() {

    if (this.product.quantity != 0) {
      this.detailSale.quantity += 1;
      this.detailSale.subtotal = this.detailSale.price * this.detailSale.quantity;
      this.product.quantity -= 1;
    } else {
      return;
    }
  }


}
