import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { VendorService } from 'src/app/services/vendor.service';
import { Vendor } from 'src/app/models/vendor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.page.html',
  styleUrls: ['./vendors.page.scss'],
})
export class VendorsPage implements OnInit {
  public vendors = new Array<Vendor>(); //me sirve para carrgar el skeleton de ionic.
  vendorSubcription: Subscription;

  constructor(
    private appService: AppService,
    private firestore: AngularFirestore,
    private alertCtrl: AlertController,
    private vendorService: VendorService
  ) { }

  ngOnInit() {
    this.getVendors();
  }

  //uso este metodo porque me los otros metodos no me devuelven el ID
  async getVendors() {
    try {
      this.vendorSubcription = this.firestore.collection("vendors", ref => ref.orderBy("timestamp", "desc")).snapshotChanges().subscribe(
        data => {
          this.vendors = data.map(e => {
            return {
              id: e.payload.doc.id,
              name: e.payload.doc.data()["name"],
              lastName: e.payload.doc.data()["lastName"],
              phone: e.payload.doc.data()["phone"],
              address: e.payload.doc.data()["address"],
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
      message: 'Desea eliminar este vendedor?',
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
            this.vendorService.deleteVendor(id);
            //this.navCtrl.navigateRoot('admin');
          }
        }
      ]
    });
    await alert.present();
    
  }

  //para que la subscripcion no este corriendo en segundo plano, destruimos
  ngOnDestroy() {
    this.vendorSubcription.unsubscribe();
  }

}
