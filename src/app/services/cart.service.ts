import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'glow_beauty_cart_v2';
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  private countSubject = new BehaviorSubject<number>(0);
  public count$ = this.countSubject.asObservable();

  constructor(private storage: StorageService) {
    this.loadCart();
  }

  /**
   * Consulta (Read): Load persisted cart from Capacitor Preferences
   */
  public async loadCart(): Promise<CartItem[]> {
    try {
      const saved = await this.storage.get<CartItem[]>(this.STORAGE_KEY);
      if (saved && Array.isArray(saved)) {
        this.itemsSubject.next(saved);
        this.updateCount(saved);
        return saved;
      }
    } catch (e) {
      console.error('CartService: Error loading cart from persistent storage:', e);
    }
    this.itemsSubject.next([]);
    this.updateCount([]);
    return [];
  }

  private async saveCart(items: CartItem[]): Promise<void> {
    this.itemsSubject.next(items);
    this.updateCount(items);
    try {
      await this.storage.set(this.STORAGE_KEY, items);
    } catch (e) {
      console.error('CartService: Error saving cart to persistent storage:', e);
    }
  }

  private updateCount(items: CartItem[]) {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    this.countSubject.next(totalCount);
  }

  public getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  /**
   * Alta (Create): Add an item to the shopping cart
   */
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

  /**
   * Modificación (Update): Update product quantity
   */
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

  /**
   * Eliminación (Delete): Remove single item from cart
   */
  public removeFromCart(productId: number): void {
    const filtered = this.itemsSubject.value.filter(item => item.product.id !== productId);
    this.saveCart(filtered);
  }

  /**
   * Eliminación (Delete): Empty entire cart
   */
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
