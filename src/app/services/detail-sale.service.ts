import { DetailSale } from './../models/detail-sale';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetailSaleService {
  private detailSale = {} as DetailSale;

  constructor(
    private firestore: AngularFirestore
  ) { }

  async getDetailsSale() {
    return this.firestore.collection("details-sale").valueChanges();
  }

  async addDetailsSale(detailSale: DetailSale) {
    return this.firestore.collection("details-sale").add(detailSale);
  }

  async deleteDetailSale(id: string) {
    return this.firestore.doc("details-sale/" + id).delete();
  }

}
