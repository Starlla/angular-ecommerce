import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyShopFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let months: number[] = [];

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      months.push(theMonth);
    }

    return of(months);
  }

  getCreditCardYears(): Observable<number[]> {
    let years: number[] = [];

    // Build an array for "start year" to "start year + 10"
    let startYear: number = new Date().getFullYear();
    let endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      years.push(theYear);
    }

    return of(years);
  }

}
