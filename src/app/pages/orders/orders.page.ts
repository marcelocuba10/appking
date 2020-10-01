import { AlertController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { OrderService } from './../../services/order.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  public orders = new Array<Order>();
  private orderSubscription: Subscription;

  constructor(
    private readonly firestore: AngularFirestore,
    private appService: AppService,
    private alertCtrl: AlertController,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.getOrders();
  }

  async getOrders() {
    try {
      this.orderSubscription = this.firestore.collection("orders", ref => ref.orderBy("timestamp", "desc")).snapshotChanges().subscribe(data => {
        this.orders = data.map(e => {
          return {
            id: e.payload.doc.id,
            nameCustomer: e.payload.doc.data()["nameCustomer"],
            nameVendor: e.payload.doc.data()["nameVendor"],
            total: e.payload.doc.data()["total"],
            date: e.payload.doc.data()["date"],
            status: e.payload.doc.data()["status"],
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
      message: 'Desea eliminar esta pedido?',
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
            this.orderService.deleteOrder(id);
          }
        }
      ]
    });
    await alert.present();
  }

  ngDestroy() {
    this.orderSubscription.unsubscribe()
  }

}
