import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { CartService } from '../services/cart.service';

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
  customerName = '';

  constructor(
    private cartService: CartService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cartSub = this.cartService.items$.subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.customerName = user.name || 'Cliente';
    } else {
      this.customerName = 'Cliente';
    }
  }

  incrementQty(item: CartItem) {
    if (item.quantity < item.product.stock) {
      this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    } else {
      this.showToast(`Solo disponemos de ${item.product.stock} unidades en stock.`);
    }
  }

  decrementQty(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
    } else {
      this.confirmRemove(item);
    }
  }

  async confirmRemove(item: CartItem) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar producto?',
      message: `¿Deseas quitar "${item.product.name}" de tu carrito?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.cartService.removeFromCart(item.product.id);
            this.showToast('Producto eliminado del carrito.');
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
      this.discountMessage = '¡Cupón GLOW10 aplicado! (10% de descuento)';
      this.showToast('¡10% de descuento aplicado!');
    } else if (code === 'BEAUTY20') {
      this.appliedDiscountPercent = 20;
      this.isDiscountApplied = true;
      this.discountMessage = '¡Cupón BEAUTY20 aplicado! (20% de descuento)';
      this.showToast('¡20% de descuento aplicado!');
    } else {
      this.appliedDiscountPercent = 0;
      this.isDiscountApplied = false;
      this.discountMessage = 'Cupón no válido. Prueba con GLOW10.';
      this.showToast('Cupón inválido.');
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
