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

  constructor(
    public modalCtrl: ModalController,
    private detailSaleService: DetailSaleService,
    private appService: AppService,
    private loadingCtrl: LoadingController
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
    console.log("Retorno del producto:", data);

    this.detailSale.idProduct = data.id;
    this.detailSale.nameProduct = data.name;
    this.detailSale.quantity = 1; //default quantity is 1
    this.detailSale.price = data.sale_price;
    this.detailSale.subtotal = data.sale_price;
    this.detailSale.volume = data.volume;

    //info product extra
    this.product.quantity = data.quantity; //calculate stock
    this.product.image = data.image;

  }

  async saveDetailSale() {

    if (await this.formValidation()) {
      await this.presentLoading();
      //add detail-sale
      try {
        this.detailSale.idSale = this.saleId.toString();
        console.log(this.saleId)
        this.detailSaleService.addDetailsSale(this.detailSale);
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

    if (this.detailSale.quantity <= 1) {
      return;
    }
    this.detailSale.quantity -= 1;
    this.detailSale.subtotal = this.detailSale.price * this.detailSale.quantity;

  }

  increaseQuantity() {

    this.detailSale.quantity += 1;
    this.detailSale.subtotal = this.detailSale.price * this.detailSale.quantity;

  }

}
