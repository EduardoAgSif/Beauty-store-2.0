import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {
  cartCount$: Observable<number>;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartCount$ = this.cartService.count$;
  }

  ngOnInit() {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
