import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private sale = {} as Sale;

  constructor(
    private readonly firestore: AngularFirestore
  ) { }

  async getSaleById(id: string) {
    return this.firestore.doc("sales/" + id).valueChanges();
  }

  async addSale(sale: Sale) {
    return this.firestore.collection("sales").add(sale);
  }

  async deleteSale(id: string) {
    return await this.firestore.doc("sales/" + id).delete();
  }

}
