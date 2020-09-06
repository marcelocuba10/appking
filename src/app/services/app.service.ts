import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  product = {} as Product;
  private loading: any;

  constructor(
    private firestore: AngularFirestore,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Atencion',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
