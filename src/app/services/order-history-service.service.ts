import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryServiceService {

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<getResponseOrderHistory> {
    const orderHistoryUrl = `http://localhost:8080/api/orders/search/findByCustomerEmail?email=${encodeURIComponent(theEmail)}`;
    console.log('Order history URL:', orderHistoryUrl);
    return this.httpClient.get<getResponseOrderHistory>(orderHistoryUrl);
  }
}

interface getResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
  _links: {
    self: {
      href: string;
    };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
