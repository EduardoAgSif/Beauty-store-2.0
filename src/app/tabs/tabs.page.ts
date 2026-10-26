import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { homeOutline, cartOutline, personOutline, sparkles } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  private cartService = inject(CartService);
  private router = inject(Router);

  cartCount$: Observable<number>;

  constructor() {
    this.cartCount$ = this.cartService.count$;
    addIcons({
      'home-outline': homeOutline,
      'cart-outline': cartOutline,
      'person-outline': personOutline,
      'sparkles': sparkles
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
