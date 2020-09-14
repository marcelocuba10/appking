import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Sale } from '../../models/sale';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { SaleService } from 'src/app/services/sale.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {
  public sales = new Array<Sale>();
  private saleSubscription: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private saleService: SaleService,
    private appService: AppService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.getSales()
  }

  async getSales() {
    try {
      this.saleSubscription = this.firestore.collection("sales", ref => ref.orderBy("timestamp", "desc")).snapshotChanges().subscribe(data => {
        this.sales = data.map(e => {
          return {
            id: e.payload.doc.id,
            nameCustomer: e.payload.doc.data()["nameCustomer"],
            nameVendor: e.payload.doc.data()["nameVendor"],
            total: e.payload.doc.data()["total"],
            date: e.payload.doc.data()["date"],
            observation: e.payload.doc.data()["observation"]
          }
        })
      })
    } catch (error) {
      this.appService.presentToast(error)
    }
  }

  async ConfirmDelete(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Atención',
      message: 'Desea eliminar esta venta?',
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
            this.saleService.deleteSale(id);
          }
        }
      ]
    });
    await alert.present();
  }

  ngDestroy(){
    this.saleSubscription.unsubscribe()
  }

}
