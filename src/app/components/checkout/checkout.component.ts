import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartServiceService } from '../../services/cart-service.service';
import { MyShopFormService } from '../../services/my-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder, private cartService: CartServiceService, private myShopFormService: MyShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required, Validators.minLength(2)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.minLength(2)]],
      }),
      billingAddress: this.formBuilder.group({
        street: ['', [Validators.required, Validators.minLength(2)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.minLength(2)]]
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
        securityCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
        expirationMonth: ['', Validators.required],
        expirationYear: ['', Validators.required]
      })
    });

    // Subscribe to cart totals
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // Compute cart totals
    this.cartService.computeCartTotals();

    // Populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    this.myShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );

    // Populate credit card years
    this.myShopFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    );

    this.myShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  // Getter methods for customer form controls
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  onSubmit(): void {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);
    console.log(this.checkoutFormGroup.get('creditCard')?.value);

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  copyShippingAddressToBillingAddress(event: any): void {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }


  handleMonthsAndYears() {
    // Handle month and year selection logic here
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    const currentYear: number = new Date().getFullYear();

    let startMonth: number;

    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.myShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => this.creditCardMonths = data
    );
  }

  getStates(formGroupName: string): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.myShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
}
