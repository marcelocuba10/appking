import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { LoadingController, NavController } from '@ionic/angular';

import * as moment from 'moment';
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
  public categories: any;
  private loading: any;
  private productSubscription: Subscription;
  private categorySubscription: Subscription;

  constructor(
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private appService: AppService,
    private actRoute: ActivatedRoute,
    private productService: ProductService
  ) {
    //capture ID
    this.productId = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {

    if (this.productId) {
      this.getProductById();
    }
    this.getCategory();

  }

  ngOnDestroy() {
    if (this.productSubscription) this.productSubscription.unsubscribe();
    if (this.categorySubscription) this.categorySubscription.unsubscribe();
  }

  async getProductById() {

    try {
      this.productSubscription = (await this.productService.getProductById(this.productId)).valueChanges().subscribe(
        data => {
          this.product.name = data["name"];
          this.product.category = data["category"];
          this.product.created = data["created"];
          this.product.purchase_price = data["purchase_price"];
          this.product.sale_price = data["sale_price"];
          this.product.volume = data["volume"];
          this.product.quantity = data["quantity"];
          this.product.image = data["image"];
        })
    } catch (error) {
      this.appService.presentToast(error);
    }

  }

  async getCategory() {

    this.categorySubscription = (await this.productService.getCategory()).subscribe(data => {
      this.categories = data;
    })

  }

  async saveProduct() {

    await this.presentLoading();

    if (this.formValidation()) {

      this.product.created = moment().locale('es').format('L');
      this.product.timestamp = Date.now();

      if (this.productId) {
        //update product
        console.log(this.productId);
        try {
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

  async presentLoading() {

    this.loading = await this.loadingCtrl.create({
      message: "Por favor, espere.."
    });
    return this.loading.present();

  }

}
