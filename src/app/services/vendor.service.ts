import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {Vendor} from "../models/vendor";

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private vendor= {} as Vendor;

  constructor(
    private firestore: AngularFirestore
  ) { }

  async getVendorById(id: string) {
    //return await this.firestore.doc<Product>(id).valueChanges();
    return this.firestore.doc("vendors/" + id);
  }

  async addVendor(vendor: Vendor) {
    return this.firestore.collection("vendors").add(vendor);
  }

  async updateVendor(id: string, vendor: Vendor) {
    return this.firestore.doc("vendors/" + id).update(vendor);
    //return this.firestore.doc<Product>(id).set({name:'2.550'}); //si quisieramos actualizar solo un campo en especifico
  }

  async deleteVendor(id: string) {
    //return this.firestore.doc(id).delete();
    return await this.firestore.doc("vendors/" + id).delete();
  }
}
