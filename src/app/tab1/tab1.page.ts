import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  searchTerm = '';
  activeCategory = 'Todos';

  categories: string[] = ['Todos', 'Skincare', 'Maquillaje', 'Fragancias', 'Cuidado Capilar'];

  selectedProduct: Product | null = null;
  isQuickViewOpen = false;
  modalQuantity = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.isLoading = true;
    try {
      this.products = await this.productService.getProducts();
      this.applyFilters();
    } catch (e) {
      console.error('Error fetching products:', e);
      this.products = this.productService.getFallbackProducts();
      this.applyFilters();
    } finally {
      this.isLoading = false;
    }
  }

  async doRefresh(event: any) {
    await this.loadProducts();
    event.target.complete();
  }

  selectCategory(cat: string) {
    this.activeCategory = cat;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  applyFilters() {
    let list = [...this.products];

    if (this.activeCategory !== 'Todos') {
      list = list.filter(p => p.category?.toLowerCase() === this.activeCategory.toLowerCase());
    }

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }

    this.filteredProducts = list;
  }

  async addToCart(product: Product, event?: Event, quantity: number = 1) {
    if (event) {
      event.stopPropagation();
    }

    this.cartService.addToCart(product, quantity);

    const toast = await this.toastController.create({
      message: `✨ ¡"${product.name}" añadido al carrito!`,
      duration: 2000,
      position: 'top',
      color: 'success',
      cssClass: 'glow-toast'
    });
    await toast.present();

    if (this.isQuickViewOpen) {
      this.closeQuickView();
    }
  }

  openQuickView(product: Product) {
    this.selectedProduct = product;
    this.modalQuantity = 1;
    this.isQuickViewOpen = true;
  }

  closeQuickView() {
    this.isQuickViewOpen = false;
    this.selectedProduct = null;
  }

  incrementModalQty() {
    if (this.selectedProduct && this.modalQuantity < this.selectedProduct.stock) {
      this.modalQuantity++;
    }
  }

  decrementModalQty() {
    if (this.modalQuantity > 1) {
      this.modalQuantity--;
    }
  }

  scrollToProducts() {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
