import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  public products = new Array<Product>(); //me sirve para carrgar el skeleton de ionic.
  productsSubcription: Subscription;

  constructor(
    private appService: AppService,
    private firestore: AngularFirestore,
    private alertCtrl: AlertController,
    private productService: ProductService
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
              purchase_price: e.payload.doc.data()["purchase_price"],
              sale_price: e.payload.doc.data()["sale_price"],
              volume: e.payload.doc.data()["volume"],
              quantity: e.payload.doc.data()["quantity"],
              created: e.payload.doc.data()["created"]
            };
          });
        });
    } catch (error) {
      this.appService.presentToast(error);
    }
  }

  async ConfirmDelete(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Atención',
      message: 'Desea eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            console.log('Confirm Okay');
            this.productService.deleteProduct(id);
            //this.navCtrl.navigateRoot('admin');
          }
        }
      ]
    });
    await alert.present();
  }

  //para que la subscripcion no este corriendo en segundo plano, destruimos
  ngOnDestroy() {
    this.productsSubcription.unsubscribe();
  }

}
