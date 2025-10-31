import { Component } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: Product[] = [];

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts(): void {
    this.productService.getProductList().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching product list:', error);
      }
    );
  }
}
