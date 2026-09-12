import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'glow_beauty_cart';
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  private countSubject = new BehaviorSubject<number>(0);
  public count$ = this.countSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        this.itemsSubject.next(parsed);
        this.updateCount(parsed);
      }
    } catch (e) {
      console.error('Error loading cart from storage:', e);
      this.itemsSubject.next([]);
      this.updateCount([]);
    }
  }

  private saveCart(items: CartItem[]) {
    this.itemsSubject.next(items);
    this.updateCount(items);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to storage:', e);
    }
  }

  private updateCount(items: CartItem[]) {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    this.countSubject.next(totalCount);
  }

  public getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  public addToCart(product: Product, quantity: number = 1): void {
    const current = [...this.itemsSubject.value];
    const index = current.findIndex(item => item.product.id === product.id);

    if (index > -1) {
      current[index] = {
        ...current[index],
        quantity: current[index].quantity + quantity
      };
    } else {
      current.push({ product, quantity });
    }

    this.saveCart(current);
  }

  public updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const current = this.itemsSubject.value.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    this.saveCart(current);
  }

  public removeFromCart(productId: number): void {
    const filtered = this.itemsSubject.value.filter(item => item.product.id !== productId);
    this.saveCart(filtered);
  }

  public clearCart(): void {
    this.saveCart([]);
  }

  public getSubtotal(): number {
    return this.itemsSubject.value.reduce(
      (sum, item) => sum + (Number(item.product.price) * item.quantity),
      0
    );
  }

  public getTotal(discountPercent: number = 0): number {
    const subtotal = this.getSubtotal();
    const discount = subtotal * (discountPercent / 100);
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 79;
    return Math.max(0, subtotal - discount + shipping);
  }
}
