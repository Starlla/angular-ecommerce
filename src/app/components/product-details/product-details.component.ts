import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { CartItem } from '../../common/cart-item';
import { CartServiceService } from '../../services/cart-service.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartServiceService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });

  }
  handleProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      (data: Product) => {
        this.product = data;
      }
    );
  }

  addToCart() {
    if (this.product) {
      console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);

      const theCartItem = new CartItem(this.product);
      this.cartService.addToCart(theCartItem);
    }
  }

}

