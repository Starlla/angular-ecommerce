import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseUrl = `${environment.apiUrl}/checkout/purchase`;

  constructor(private httpClient: HttpClient) {
  }

  placeOrder(purchase: Purchase) {
    return this.httpClient.post<Purchase>(this.baseUrl, purchase);
  }
}
