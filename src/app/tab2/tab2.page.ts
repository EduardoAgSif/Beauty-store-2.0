import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSub!: Subscription;

  promoCode = '';
  appliedDiscountPercent = 0;
  discountMessage = '';
  isDiscountApplied = false;

  isCheckoutModalOpen = false;
  orderNumber = '';
  placedOrderTotal = 0;
  customerName = 'Customer';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cartItems = this.cartService.getItems();
    this.cartSub = this.cartService.items$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  async ionViewWillEnter() {
    this.cartItems = this.cartService.getItems();
    const user = await this.authService.getUser();
    if (user && user.name) {
      this.customerName = user.name;
    } else {
      this.customerName = 'Customer';
    }
  }

  /**
   * Modificación (Update): Increment quantity
   */
  incrementQty(item: CartItem) {
    if (item.quantity < item.product.stock) {
      this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    } else {
      this.showToast(`Only ${item.product.stock} units available in stock.`);
    }
  }

  /**
   * Modificación (Update): Decrement quantity
   */
  decrementQty(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    } else {
      this.confirmRemove(item);
    }
  }

  /**
   * Eliminación (Delete): Confirm & remove single item
   */
  async confirmRemove(item: CartItem) {
    const alert = await this.alertCtrl.create({
      header: 'Remove Item?',
      message: `Remove "${item.product.name}" from your shopping bag?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            this.cartService.removeFromCart(item.product.id);
            this.showToast('Item removed from shopping bag.');
          }
        }
      ]
    });
    await alert.present();
  }

  applyPromoCode() {
    const code = this.promoCode.trim().toUpperCase();
    if (code === 'GLOW10') {
      this.appliedDiscountPercent = 10;
      this.isDiscountApplied = true;
      this.discountMessage = 'Coupon GLOW10 applied! (10% OFF)';
      this.showToast('10% discount applied!');
    } else if (code === 'BEAUTY20') {
      this.appliedDiscountPercent = 20;
      this.isDiscountApplied = true;
      this.discountMessage = 'Coupon BEAUTY20 applied! (20% OFF)';
      this.showToast('20% discount applied!');
    } else {
      this.appliedDiscountPercent = 0;
      this.isDiscountApplied = false;
      this.discountMessage = 'Invalid coupon. Try GLOW10.';
      this.showToast('Invalid coupon code.');
    }
  }

  removeCoupon() {
    this.promoCode = '';
    this.appliedDiscountPercent = 0;
    this.isDiscountApplied = false;
    this.discountMessage = '';
  }

  getSubtotal(): number {
    return this.cartService.getSubtotal();
  }

  getDiscountAmount(): number {
    return this.getSubtotal() * (this.appliedDiscountPercent / 100);
  }

  getShipping(): number {
    const subtotal = this.getSubtotal();
    return subtotal > 500 || subtotal === 0 ? 0 : 79;
  }

  getFreeShippingProgress(): number {
    const subtotal = this.getSubtotal();
    return Math.min(100, Math.round((subtotal / 500) * 100));
  }

  getTotal(): number {
    return this.cartService.getTotal(this.appliedDiscountPercent);
  }

  goToShop() {
    this.navCtrl.navigateRoot('/tabs/tab1');
  }

  processCheckout() {
    if (this.cartItems.length === 0) return;

    this.orderNumber = 'GLOW-' + Math.floor(100000 + Math.random() * 900000);
    this.placedOrderTotal = this.getTotal();
    this.isCheckoutModalOpen = true;
  }

  finishOrder() {
    this.isCheckoutModalOpen = false;
    this.cartService.clearCart();
    this.removeCoupon();
    this.navCtrl.navigateRoot('/tabs/tab1');
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
}
