import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  public products = new Array<Product>();
  productsSubcription: Subscription;

  constructor(
    private appService: AppService,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
    this.getProducts();
  }

   //uso este metodo porque me los otros metodos no me devuelven el ID
  async getProducts() {
    try {
      this.productsSubcription = this.firestore.collection("products", ref => ref.orderBy("timestamp", "desc")).snapshotChanges().subscribe(
        data => {
          this.products = data.map(e => {
            return {
              id: e.payload.doc.id,
              name: e.payload.doc.data()["name"],
              category: e.payload.doc.data()["category"],
              created: e.payload.doc.data()["created"],
              purchase_price: e.payload.doc.data()["purchase_price"],
              sale_price: e.payload.doc.data()["sale_price"],
              volume: e.payload.doc.data()["volume"],
              quantity: e.payload.doc.data()["quantity"]
            };
          });
        });
    } catch (error) {
      this.appService.presentToast(error);
    }
  }

  //para que la subscripcion no este corriendo en segundo plano, destruimos
  ngOnDestroy() {
    this.productsSubcription.unsubscribe();
  }

}
