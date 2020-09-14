import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customer= {} as Customer; 

  constructor(
    private firestore: AngularFirestore
  ) { }

  async getCustomerById(id: string) {
    //return await this.firestore.doc<Product>(id).valueChanges();
    return this.firestore.doc("customers/" + id);
  }

  async getCustomers(){
    return this.firestore.collection("customers").valueChanges();
  }

  async getCustomerByIdAux(id: string){
    return this.firestore.doc("customers/" + id).valueChanges();
  }

  async addCustomer(customer: Customer) {
    return this.firestore.collection("customers").add(customer);
  }

  async updateCustomer(id: string, customer: Customer) {
    return this.firestore.doc("customers/" + id).update(customer);
    //return this.firestore.doc<Product>(id).set({name:'2.550'}); //si quisieramos actualizar solo un campo en especifico
  }

  async deleteCustomer(id: string) {
    //return this.firestore.doc(id).delete();
    return await this.firestore.doc("customers/" + id).delete();
  }
}
