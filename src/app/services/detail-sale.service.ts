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

  async getDetail() {
    return this.firestore.collection("details-sale").valueChanges();
  }

  async getDetailById(id: string) {
    return this.firestore.doc("details-sale/" + id).valueChanges();
  }

  async addDetail(detailSale: DetailSale) {
    return this.firestore.collection("details-sale").add(detailSale);
  }

  async updateDetail(id: string, detail: DetailSale) {
    return this.firestore.doc("details-sale/" + id).update(detail);
  }

  async deleteDetailSale(id: string) {
    return this.firestore.doc("details-sale/" + id).delete();
  }

}
