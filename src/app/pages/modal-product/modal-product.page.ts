import { DetailSale } from './../../models/detail-sale';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppService } from './../../services/app.service';
import { Subscription } from 'rxjs';
import { Product } from './../../models/product';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.page.html',
  styleUrls: ['./modal-product.page.scss'],
})
export class ModalProductPage implements OnInit {
  public products = new Array<Product>();
  private productsSubcription: Subscription;

  // Data passed in by modal-detail
  @Input() saleId: string;

  constructor(
    private modalCtrl: ModalController,
    private appService: AppService,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  async getProducts() {

    try {
      this.productsSubcription = this.firestore.collection("products", ref => ref.orderBy("timestamp", "desc")).snapshotChanges().subscribe(
        data => {
          this.products = data.map(e => {
            return {
              id: e.payload.doc.id,
              name: e.payload.doc.data()["name"],
              category: e.payload.doc.data()["category"],
              purchase_price: e.payload.doc.data()["purchase_price"],
              sale_price: e.payload.doc.data()["sale_price"],
              volume: e.payload.doc.data()["volume"],
              quantity: e.payload.doc.data()["quantity"],
              created: e.payload.doc.data()["created"],
              image: e.payload.doc.data()["image"],
              timestamp: e.payload.doc.data()["timestamp"]
            };
          });
        });
    } catch (error) {
      this.appService.presentToast(error);
    }

  }

  ngOnDestroy() {
    this.productsSubcription.unsubscribe();
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  goToModalDetail(product: Product) {
    this.modalCtrl.dismiss(product);
  }
}
