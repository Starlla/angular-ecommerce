import { Component } from '@angular/core';
import { OrderHistoryServiceService } from '../../services/order-history-service.service';
import { OrderHistory } from '../../common/order-history';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {
  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryServiceService) {
  }

  ngOnInit(): void {
    let theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    console.log('Email being used for order history:', theEmail);

    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        console.log('Full API response:', data);
        this.orderHistoryList = data._embedded.orders;
        console.log('Orders found:', this.orderHistoryList.length);
      }
    );
  }


}
