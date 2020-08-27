import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  public customers = new Array<Customer>();
  private customerSubscription: Subscription;

  constructor(
    private appService: AppService,
    private firestore: AngularFirestore,
    private alertCtrl: AlertController,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    this.getCustomers();
  }

  async getCustomers() {
    try {
      this.customerSubscription = this.firestore.collection("customers", ref => ref.orderBy("timestamp", "desc")).snapshotChanges().subscribe(
        data => {
          this.customers = data.map(e => {
            return {
              id: e.payload.doc.id,
              name: e.payload.doc.data()["name"],
              phone: e.payload.doc.data()["phone"],
              address: e.payload.doc.data()["address"],
              ruc: e.payload.doc.data()["ruc"],
              saleman: e.payload.doc.data()["salesman"],
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
      message: 'Desea eliminar este cliente?',
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
            this.customerService.deleteCustomer(id);
            //this.navCtrl.navigateRoot('admin');
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnDestroy() {
    this.customerSubscription.unsubscribe();
  }

}
