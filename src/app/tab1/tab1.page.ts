import { Component, OnInit, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

export interface HeroSlide {
  id: number;
  productId: number;
  tag: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  category: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastController = inject(ToastController);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  bestSellers: Product[] = [];
  isLoading = true;
  searchTerm = '';
  activeCategory = 'All';

  categories: string[] = ['All', 'Skincare', 'Makeup', 'Fragrances', 'Hair Care'];

  selectedProduct: Product | null = null;
  isQuickViewOpen = false;
  modalQuantity = 1;

  heroSlides: HeroSlide[] = [
    {
      id: 1,
      productId: 1,
      tag: '✨ #1 Best Seller',
      title: 'L\u2019Élixir Doré Face Oil',
      subtitle: 'Deep botanical nourishment infused with plant squalane and golden pearls.',
      imageUrl: '',
      category: 'Skincare'
    },
    {
      id: 2,
      productId: 5,
      tag: '⭐ Signature Fragrance',
      title: 'Rose & Amber Gold Eau de Parfum',
      subtitle: 'Enchanting notes of golden bourbon vanilla, white orchid, and sandalwood.',
      imageUrl: '',
      category: 'Fragrances'
    },
    {
      id: 3,
      productId: 3,
      tag: '💄 Beige & Nude Collection',
      title: 'Velvet Nude Matte Lipstick',
      subtitle: 'Creamy warm nude lipstick enriched with organic jojoba oil and vitamin E.',
      imageUrl: '',
      category: 'Makeup'
    },
    {
      id: 4,
      productId: 8,
      tag: '🎨 Neutral Palette',
      title: 'Warm Taupe & Beige Palette',
      subtitle: 'Curated 9-pan eyeshadow collection in warm neutral, smoky taupe, and champagne shimmer.',
      imageUrl: '',
      category: 'Makeup'
    }
  ];

  ngOnInit() {
    // Instant fallback loading for smooth experience
    this.products = this.productService.getFallbackProducts();
    this.syncSlideImages();   // pre-resolve gallery images from fallback
    this.updateBestSellers();
    this.applyFilters();
    this.isLoading = false;

    this.loadProducts();
  }

  onSlideClick(slide: HeroSlide) {
    const found = this.products.find(p => p.id === slide.productId);
    if (found) {
      this.openQuickView(found);
    }
  }

  updateBestSellers() {
    if (this.products && this.products.length > 0) {
      // Prioritize featured and top rated products
      this.bestSellers = [...this.products]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews_count || 0) - (a.reviews_count || 0))
        .slice(0, 4);
    }
  }

  async loadProducts() {
    try {
      const serverProducts = await this.productService.getProducts();
      if (serverProducts && serverProducts.length > 0) {
        this.products = serverProducts;
        this.syncSlideImages();  // keep gallery in sync when server products arrive
        this.updateBestSellers();
        this.applyFilters();
      }
    } catch (e) {
      console.warn('Using local luxury catalog:', e);
      if (this.products.length === 0) {
        this.products = this.productService.getFallbackProducts();
        this.updateBestSellers();
        this.applyFilters();
      }
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

    if (this.activeCategory !== 'All') {
      const active = this.activeCategory.toLowerCase();
      list = list.filter(p => {
        const cat = (p.category || '').toLowerCase();
        if (active === 'makeup') return cat.includes('maquillaje') || cat.includes('makeup');
        if (active === 'fragrances') return cat.includes('fragancia') || cat.includes('fragrance');
        if (active === 'hair care') return cat.includes('capilar') || cat.includes('hair');
        return cat.includes(active);
      });
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

    // Instant synchronous cart update
    this.cartService.addToCart(product, quantity);

    // Display non-blocking feedback toast
    this.toastController.create({
      message: `✨ "${product.name}" added to shopping bag!`,
      duration: 1800,
      position: 'top',
      color: 'success',
      cssClass: 'glow-toast'
    }).then(t => t.present());

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

  scrollToBestSellers() {
    const el = document.getElementById('bestsellers-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Pre-resolves each hero slide's imageUrl from the loaded products array.
   * Falls back to the product service's own fallback list if the live products
   * don't include the required productId (e.g. server has fewer items).
   */
  syncSlideImages() {
    const fallback = this.productService.getFallbackProducts();
    this.heroSlides = this.heroSlides.map(slide => {
      const product =
        this.products.find(p => p.id === slide.productId) ||
        fallback.find(p => p.id === slide.productId);
      return { ...slide, imageUrl: product?.image_url ?? '' };
    });
  }

  /** Use the current product image, falling back to the last resolved slide URL. */
  getSlideImage(slide: HeroSlide): string {
    return this.products.find(product => product.id === slide.productId)?.image_url || slide.imageUrl;
  }
}
