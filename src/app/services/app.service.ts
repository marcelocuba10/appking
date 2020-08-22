import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  product = {} as Product;

  constructor(
    private firestore: AngularFirestore,
    private toastCtrl: ToastController
  ) { }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
