import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartServiceService } from '../../services/cart-service.service';
import { MyShopFormService } from '../../services/my-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { MyShopValidators } from '../../validators/my-shop-validators';

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
        firstName: ['', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]],
        lastName: ['', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]],
        city: ['', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]],
      }),
      billingAddress: this.formBuilder.group({
        street: ['', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]],
        city: ['', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.minLength(2), MyShopValidators.notOnlyWhitespace]]
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

  // Getter methods for shipping address form controls
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  // Getter methods for billing address form controls
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

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
