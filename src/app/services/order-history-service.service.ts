import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryServiceService {

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<getResponseOrderHistory> {
    const orderHistoryUrl = `${environment.apiUrl}/orders/search/findByCustomerEmailOrderByDateCreatedDesc?email=${encodeURIComponent(theEmail)}`;
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
