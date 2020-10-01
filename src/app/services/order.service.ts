import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import {Order} from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private order= {} as Order;

  constructor(
    private readonly firestore: AngularFirestore
  ) { }

  async getOrderById(id: string) {
    console.log(id);
    return this.firestore.doc("orders/" + id).valueChanges();
  }

  async addOrder(order: Order) {
    return this.firestore.collection("orders").add(order);
  }

  async deleteOrder(id:string){
    this.firestore.doc("orders/" + id).delete();
  }

  async updateOrder(id: string, order: Order) {
    return this.firestore.doc("orders/" + id).update(order);
  }

}
