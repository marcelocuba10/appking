import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

import * as moment from 'moment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.page.html',
  styleUrls: ['./detail-product.page.scss'],
})
export class DetailProductPage implements OnInit {
  private productId: any;
  public product = {} as Product;
  private loading: any;
  private productSubscription: Subscription;

  constructor(
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private appService: AppService,
    private actRoute: ActivatedRoute,
    private productService: ProductService
  ) {
    //captura el ID
    this.productId = this.actRoute.snapshot.paramMap.get("id");
    console.log(this.productId);
  }

  ngOnInit() {
    this.getProductById();
  }

  ngOnDestroy() {
    if (this.productSubscription) this.productSubscription.unsubscribe();
  }

  async getProductById() {
    this.productSubscription = (await this.productService.getProductById(this.productId)).valueChanges().subscribe(
      data => {
        this.product.name = data["name"];
        this.product.category = data["category"];
        this.product.created = data["created"];
        this.product.purchase_price = data["purchase_price"];
        this.product.sale_price = data["sale_price"];
        this.product.volume = data["volume"];
        this.product.quantity = data["quantity"];
        console.log(this.product);
      })
  }

  async saveProduct() {

    await this.presentLoading();

    if (this.formValidation()) {

      if (this.productId) {
        //update product
        console.log(this.productId);
        try {
          this.product.created = new Date().getTime();
          this.product.timestamp = Date.now();

          await this.productService.updateProduct(this.productId, this.product);
          this.loading.dismiss();
          this.navCtrl.navigateRoot("/product");

        } catch (error) {
          this.appService.presentToast(error);
          this.loading.dismiss();
        }

      } else {
        //create product
        try {
          //this.product.created = moment().locale('es').format('dddd, D MMMM, h:mm a');
          this.product.created = new Date().getTime();
          this.product.timestamp = Date.now();

          await this.productService.addProduct(this.product);
          this.loading.dismiss();
          this.navCtrl.navigateRoot("/product");

        } catch (error) {
          this.appService.presentToast(error);
          this.loading.dismiss();
        }
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Por favor, espere.."
    });
    return this.loading.present();
  }

  formValidation() {
    if (!this.product.name) {
      this.appService.presentToast("Ingrese nombre del producto");
      this.loading.dismiss();
      return false;
    }

    if (!this.product.category) {
      this.appService.presentToast("Ingrese una categoria");
      this.loading.dismiss();
      return false;
    }

    if (!this.product.purchase_price) {
      this.appService.presentToast("Ingrese precio compra");
      this.loading.dismiss();
      return false;
    }

    if (!this.product.sale_price) {
      this.appService.presentToast("Ingrese precio venta");
      this.loading.dismiss();
      return false;
    }

    if (!this.product.quantity) {
      this.appService.presentToast("Ingrese cantidad stock");
      this.loading.dismiss();
      return false;
    }

    return true;
  }

}
