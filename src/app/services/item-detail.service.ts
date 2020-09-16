import { OrderDetail } from './../models/order-detail';
import { DetailSale } from './../models/detail-sale';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailService {
  private detailSale = {} as DetailSale;
  private detailOrder = {} as OrderDetail;

  constructor(
    private readonly firestore: AngularFirestore
  ) { }

  // detail sale functions

  async addDetailSale(detailSale: DetailSale) {
    return this.firestore.collection("details-sale").add(detailSale);
  }

  async deleteDetailSale(id: string) {
    return this.firestore.doc("details-sale/" + id).delete();
  }

  // detail order functions

  async addDetailOrder(detailOrder: OrderDetail) {
    return this.firestore.collection("details-order").add(detailOrder);
  }

  async deleteDetailOrder(id: string) {
    return this.firestore.doc("details-order/" + id).delete();
  }

}
