import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { AppService } from './app.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection: AngularFirestoreCollection<Product>;
  public products = new Array<Product>();
  constructor(
    private firestore: AngularFirestore,
  ) {
    this.productsCollection = this.firestore.collection<Product>('Products');
  }

  async getProducts() {
    // return this.productsCollection.snapshotChanges().pipe(
    //   map(actions => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data();
    //       const id = a.payload.doc.id;

    //       return { id, ...data };
    //     });
    //   })
    // );

    return this.firestore.collection("products", ref => ref.orderBy("timestamp", "desc")).valueChanges();

  }

  async getProductById(id: string) {
    //return await this.firestore.doc<Product>(id).valueChanges();
    return this.firestore.doc("products/" + id);
  }

  async addProduct(product: Product) {
    return this.firestore.collection("products").add(product);
  }

  async updateProduct(id: string, product: Product) {
    return this.firestore.doc("products/" + id).update(product);
    //return this.firestore.doc<Product>(id).set({name:'2.550'}); //si quisieramos actualizar solo un campo en especifico
  }

  deleteProduct(id: string) {
    return this.firestore.doc(id).delete();
  }

}
