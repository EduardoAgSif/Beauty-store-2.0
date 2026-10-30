import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { DataSourceConfigService, RequestDiagnostics } from './data-source-config.service';
import { StorageService } from './storage.service';

export type ProductPayload = Pick<Product, 'name' | 'description' | 'price' | 'stock'>;
export type ProductPatch = Partial<ProductPayload>;

export interface ApiResult<T> {
  httpStatus: number;
  data: T;
  diagnostics: RequestDiagnostics;
}

interface ProductApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  id?: number | string;
}

export type ProductDataSource = 'remote' | 'local_cache' | 'fallback';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly dataSourceConfig = inject(DataSourceConfigService);
  private readonly storageService = inject(StorageService, { optional: true });

  private readonly STORAGE_KEY_PRODUCTS = 'elvi_cached_products';

  private readonly dataSourceSubject = new BehaviorSubject<ProductDataSource>('fallback');
  public readonly dataSource$: Observable<ProductDataSource> = this.dataSourceSubject.asObservable();

  // 12 Curated Luxury Beauty Products with Soft Champagne, Pearl, Warm Beige & Gold Accents
  private defaultBeautyProducts: Product[] = [
    {
      id: 1,
      name: 'L’Élixir Doré Glow Face Oil',
      description: 'Nourishing facial oil infused with plant-derived squalane, cold-pressed rosehip seed oil, and golden micro-pearls for a radiant, silky complexion.',
      price: 640.00,
      stock: 24,
      category: 'Skincare',
      image_url: 'assets/products/Face-oil.jpg',
      rating: 4.9,
      reviews_count: 142,
      is_featured: true
    },
    {
      id: 2,
      name: 'Champagne Silk Hydrating Cream',
      description: 'Ultra-lightweight moisturizer with micronized white pearl extract, triple ceramides, and hyaluronic acid for deep, non-greasy nourishment.',
      price: 520.00,
      stock: 32,
      category: 'Skincare',
      image_url: 'assets/products/silk-hidrating-cream.jpg',
      rating: 4.8,
      reviews_count: 98,
      is_featured: true
    },
    {
      id: 3,
      name: 'Velvet Nude Matte Lipstick',
      description: 'Velvety warm nude matte lipstick enriched with organic jojoba oil and vitamin E. Comfortable 16-hour long-wear finish.',
      price: 290.00,
      stock: 45,
      category: 'Makeup',
      image_url: 'assets/products/velvet-lipstick.jpg',
      rating: 4.9,
      reviews_count: 112,
      is_featured: true
    },
    {
      id: 4,
      name: 'Subtle Glow Liquid Illuminator',
      description: 'Fluid champagne pearl illuminator that seamlessly melts into skin, leaving a dewy, sophisticated candlelit glow.',
      price: 380.00,
      stock: 18,
      category: 'Makeup',
      image_url: 'assets/products/liquid-iluminator.jpg',
      rating: 4.7,
      reviews_count: 67,
      is_featured: false
    },
    {
      id: 5,
      name: 'Rose & Amber Gold Eau de Parfum',
      description: 'Captivating luxury fragrance with notes of golden bourbon vanilla, white orchid, Damask rose, and a warm sandalwood-amber base.',
      price: 980.00,
      stock: 15,
      category: 'Fragrances',
      image_url: 'assets/products/rose-parfume.jpg',
      rating: 5.0,
      reviews_count: 89,
      is_featured: true
    },
    {
      id: 6,
      name: 'Botanical Gold Repair Hair Serum',
      description: 'Restorative hair serum featuring organic Moroccan argan oil and bioactive keratin to seal split ends and deliver lustrous satin shine.',
      price: 450.00,
      stock: 20,
      category: 'Hair Care',
      image_url: 'assets/products/heair-repair-serum.jpg',
      rating: 4.9,
      reviews_count: 76,
      is_featured: false
    },
    {
      id: 7,
      name: 'Pearl Radiance Gentle Cleanser',
      description: 'Gentle foaming cleanser with natural micronized pearl and antioxidant white tea to purify pores while preserving your moisture barrier.',
      price: 320.00,
      stock: 35,
      category: 'Skincare',
      image_url: 'assets/products/Gentle-clenser.jpg',
      rating: 4.7,
      reviews_count: 54,
      is_featured: false
    },
    {
      id: 8,
      name: 'Warm Taupe Eyeshadow Palette',
      description: 'Curated 9-pan eyeshadow palette with warm neutrals, smoky taupe, and champagne shimmer textures in an ultra-blendable velvety finish.',
      price: 560.00,
      stock: 28,
      category: 'Makeup',
      image_url: 'assets/products/Eyeshadow-palette.jpg',
      rating: 4.8,
      reviews_count: 93,
      is_featured: true
    },
    {
      id: 9,
      name: 'Golden Orchid Luxury Body Mist',
      description: 'Delicate perfumed body mist infused with golden orchid nectar and wild jasmine for an all-day refreshing floral veil.',
      price: 410.00,
      stock: 22,
      category: 'Fragrances',
      image_url: 'assets/products/Body-mist.jpg',
      rating: 4.6,
      reviews_count: 41,
      is_featured: false
    },
    {
      id: 10,
      name: 'Hydra-Plump Lip Treatment Balm',
      description: 'Restorative lip treatment balm enriched with volumizing peptides, organic mango butter, and plant waxes for soft, pillowy lips.',
      price: 220.00,
      stock: 50,
      category: 'Makeup',
      image_url: 'assets/products/Lip-balm.jpg',
      rating: 4.8,
      reviews_count: 82,
      is_featured: false
    },
    {
      id: 11,
      name: 'Nourishing Cashmere Hair Mask',
      description: 'Deep conditioning treatment formulated with cashmere silk proteins and murumuru butter for ultra-soft, manageable hair.',
      price: 490.00,
      stock: 16,
      category: 'Hair Care',
      image_url: 'assets/products/Hair-mask.jpg',
      rating: 4.9,
      reviews_count: 65,
      is_featured: false
    },
    {
      id: 12,
      name: 'Pure Gold Eye Contour Cream',
      description: 'Youth-restoring eye contour cream with pure caffeine, colloidal gold, and firming peptides to diminish dark circles and fine lines.',
      price: 590.00,
      stock: 25,
      category: 'Skincare',
      image_url: 'assets/products/Eye-contour.jpg',
      rating: 4.9,
      reviews_count: 104,
      is_featured: true
    }
  ];

  /**
   * Main method to obtain products.
   * Online: attempts remote API, caches in StorageService, updates state.
   * Offline / Remote Error: retrieves from persistent StorageService; falls back to default list if storage is empty.
   */
  public async getProducts(): Promise<Product[]> {
    const isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;

    if (!isOffline) {
      try {
        const response = await this.listApiProducts();
        const products = response.data;
        if (products.length > 0) {
          // Persist to local storage
          if (this.storageService) {
            await this.storageService.set(this.STORAGE_KEY_PRODUCTS, products);
          }
          this.dataSourceSubject.next('remote');
          return products;
        }
      } catch (e) {
        console.warn('ProductService: Remote API request failed; falling back to local storage cache.', e);
      }
    }

    // Offline or remote error: check local storage cache
    if (this.storageService) {
      const cached = await this.storageService.get<Product[]>(this.STORAGE_KEY_PRODUCTS);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        const normalized = cached.map(p => ({
          ...p,
          image_url: this.resolveLocalImage(p.id, p.name, p.image_url)
        }));
        this.dataSourceSubject.next('local_cache');
        return normalized;
      }
    }

    this.dataSourceSubject.next('fallback');
    return this.getFallbackProducts();
  }

  public async listApiProducts(): Promise<ApiResult<Product[]>> {
    const response = await this.request<ProductApiResponse<unknown>>('GET');
    if (!this.isSuccessfulResponse(response.data) || !Array.isArray(response.data.data)) {
      response.diagnostics.error = 'La API respondió, pero no devolvió una lista de productos válida.';
      response.diagnostics.response = this.dataSourceConfig.safeResponse(response.data);
      throw Object.assign(new Error('La API no devolvió una lista de productos válida.'), {
        requestDiagnostics: response.diagnostics
      });
    }
    try {
      return {
        httpStatus: response.httpStatus,
        data: this.mapProducts(response.data.data),
        diagnostics: response.diagnostics
      };
    } catch (error: unknown) {
      response.diagnostics.error = error instanceof Error ? error.message : 'La API devolvió productos inválidos.';
      response.diagnostics.response = this.dataSourceConfig.safeResponse(response.data);
      throw Object.assign(error instanceof Error ? error : new Error(response.diagnostics.error), {
        requestDiagnostics: response.diagnostics
      });
    }
  }

  public async createProduct(payload: ProductPayload): Promise<ApiResult<{ id: number; message: string }>> {
    const isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;

    // If offline, save locally
    if (isOffline) {
      const localId = Date.now();
      const newProduct: Product = {
        id: localId,
        name: payload.name,
        description: payload.description,
        price: Number(payload.price),
        stock: Number(payload.stock),
        category: 'Skincare',
        image_url: 'assets/products/Face-oil.jpg',
        rating: 5.0,
        reviews_count: 1,
        is_featured: false
      };

      if (this.storageService) {
        const cached = (await this.storageService.get<Product[]>(this.STORAGE_KEY_PRODUCTS)) || this.getFallbackProducts();
        cached.unshift(newProduct);
        await this.storageService.set(this.STORAGE_KEY_PRODUCTS, cached);
      }

      return {
        httpStatus: 200,
        data: {
          id: localId,
          message: 'Producto guardado en almacenamiento local.'
        },
        diagnostics: {
          timestamp: new Date().toISOString(),
          method: 'OFFLINE_PERSIST',
          url: 'local://storage',
          protocol: 'local',
          host: 'device',
          port: 0,
          headers: {},
          payload
        }
      };
    }

    // Online execution
    const response = await this.request<ProductApiResponse<never>>('POST', undefined, payload);
    if (!this.isSuccessfulResponse(response.data) || response.data.id === undefined) {
      throw Object.assign(
        new Error(this.getResponseMessage(response.data) || 'La API no confirmó la creación del producto.'),
        { requestDiagnostics: response.diagnostics }
      );
    }

    // Update local cache with newly created product
    if (this.storageService) {
      try {
        const remote = await this.listApiProducts();
        await this.storageService.set(this.STORAGE_KEY_PRODUCTS, remote.data);
      } catch (_) {}
    }

    return {
      httpStatus: response.httpStatus,
      data: { id: Number(response.data.id), message: response.data.message || 'Producto creado.' },
      diagnostics: response.diagnostics
    };
  }

  public async replaceProduct(id: number, payload: ProductPayload): Promise<ApiResult<{ message: string }>> {
    const response = await this.request<ProductApiResponse<never>>('PUT', id, payload);
    return this.successResult(response, 'No se pudo reemplazar el producto.');
  }

  public async patchProduct(id: number, payload: ProductPatch): Promise<ApiResult<{ message: string }>> {
    if (Object.keys(payload).length === 0) {
      throw new Error('Indica al menos un campo para actualizar.');
    }
    const response = await this.request<ProductApiResponse<never>>('PATCH', id, payload);
    return this.successResult(response, 'No se pudo actualizar el producto.');
  }

  public async deleteProduct(id: number): Promise<ApiResult<{ message: string }>> {
    const response = await this.request<ProductApiResponse<never>>('DELETE', id);
    return this.successResult(response, 'No se pudo eliminar el producto.');
  }

  /**
   * Refreshes the local cache from the remote server
   */
  public async syncRemoteAndQueue(): Promise<void> {
    const isOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;
    if (isOffline) {
      return;
    }

    try {
      const response = await this.listApiProducts();
      if (response.data && response.data.length > 0) {
        if (this.storageService) {
          await this.storageService.set(this.STORAGE_KEY_PRODUCTS, response.data);
        }
        this.dataSourceSubject.next('remote');
      }
    } catch (err) {
      console.warn('Error fetching fresh remote products during sync:', err);
    }
  }

  private async request<T>(method: string, id?: number, payload?: unknown): Promise<ApiResult<T>> {
    const apiUrl = await this.dataSourceConfig.getEndpoint('api.php');
    const url = id === undefined ? apiUrl : `${apiUrl}?id=${encodeURIComponent(id)}`;
    const result = await this.dataSourceConfig.request<T>(method, url, payload ?? null, {
      Accept: 'application/json',
      ...(payload === undefined ? {} : { 'Content-Type': 'application/json' })
    });
    return { httpStatus: result.status, data: result.data, diagnostics: result.diagnostics };
  }

  private successResult(
    response: ApiResult<ProductApiResponse<never>>,
    fallbackMessage: string
  ): ApiResult<{ message: string }> {
    if (!this.isSuccessfulResponse(response.data)) {
      throw Object.assign(
        new Error(this.getResponseMessage(response.data) || fallbackMessage),
        { requestDiagnostics: response.diagnostics }
      );
    }
    return {
      httpStatus: response.httpStatus,
      data: { message: response.data.message || 'Operación completada.' },
      diagnostics: response.diagnostics
    };
  }

  private isSuccessfulResponse(value: unknown): value is ProductApiResponse<unknown> {
    return Boolean(value && typeof value === 'object' && 'status' in value && value.status === 'success');
  }

  private getResponseMessage(value: unknown): string | undefined {
    if (value && typeof value === 'object' && 'message' in value && typeof value.message === 'string') {
      return value.message;
    }
    return undefined;
  }

  public resolveLocalImage(id?: number, name?: string, providedUrl?: string): string {
    if (providedUrl && providedUrl.startsWith('assets/products/')) {
      return providedUrl;
    }
    const numId = Number(id);
    const byId = this.defaultBeautyProducts.find(d => d.id === numId);
    if (byId && byId.image_url) return byId.image_url;

    const lowerName = (name || '').toLowerCase();
    const byName = this.defaultBeautyProducts.find(d =>
      lowerName.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(lowerName)
    );
    if (byName && byName.image_url) return byName.image_url;

    if (lowerName.includes('oil') || lowerName.includes('aceite')) return 'assets/products/Face-oil.jpg';
    if (lowerName.includes('cream') || lowerName.includes('crema') || lowerName.includes('hidrat')) return 'assets/products/silk-hidrating-cream.jpg';
    if (lowerName.includes('lipstick') || lowerName.includes('labial')) return 'assets/products/velvet-lipstick.jpg';
    if (lowerName.includes('illuminator') || lowerName.includes('iluminad')) return 'assets/products/liquid-iluminator.jpg';
    if (lowerName.includes('parfum') || lowerName.includes('perfume') || lowerName.includes('fragran') || lowerName.includes('rose')) return 'assets/products/rose-parfume.jpg';
    if (lowerName.includes('serum')) return 'assets/products/heair-repair-serum.jpg';
    if (lowerName.includes('clean') || lowerName.includes('limpia')) return 'assets/products/Gentle-clenser.jpg';
    if (lowerName.includes('palette') || lowerName.includes('sombra')) return 'assets/products/Eyeshadow-palette.jpg';
    if (lowerName.includes('mist') || lowerName.includes('bruma')) return 'assets/products/Body-mist.jpg';
    if (lowerName.includes('balm') || lowerName.includes('balsamo')) return 'assets/products/Lip-balm.jpg';
    if (lowerName.includes('mask') || lowerName.includes('mascar')) return 'assets/products/Hair-mask.jpg';
    if (lowerName.includes('eye') || lowerName.includes('ojo') || lowerName.includes('contorno')) return 'assets/products/Eye-contour.jpg';

    return 'assets/products/Face-oil.jpg';
  }

  private mapProducts(products: unknown[]): Product[] {
    return products.map((value, index) => {
      if (!value || typeof value !== 'object') {
        throw new Error('La API devolvió un producto con formato inválido.');
      }
      const product = value as Partial<Product>;
      const numId = Number(product.id);
      const fallback = this.defaultBeautyProducts.find(d => d.id === numId) || this.defaultBeautyProducts[index % this.defaultBeautyProducts.length];
      return {
        id: numId || fallback.id,
        name: product.name || fallback.name,
        description: product.description || fallback.description,
        price: Number(product.price ?? fallback.price),
        stock: Number(product.stock ?? fallback.stock),
        category: product.category || fallback.category,
        image_url: this.resolveLocalImage(numId || fallback.id, product.name || fallback.name, product.image_url),
        rating: fallback.rating,
        reviews_count: fallback.reviews_count,
        is_featured: fallback.is_featured ?? (index < 4)
      };
    });
  }

  public getFallbackProducts(): Product[] {
    return JSON.parse(JSON.stringify(this.defaultBeautyProducts));
  }
}
