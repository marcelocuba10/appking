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

  async getDetailsSale(saleId: string) {
    //return this.firestore.doc("detail-sales/" + saleId).valueChanges();

    return this.firestore.collection("details-sale", ref => ref.where('idSale', '==', saleId));
  }

  async addDetailsSale(detailSale: DetailSale) {
    return this.firestore.collection("details-sale").add(detailSale).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
  }

  async deleteDetailSale(id: string) {
    return await this.firestore.doc("details-sale/" + id).delete();
  }

}
