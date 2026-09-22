import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import axios from 'axios';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost/backend/api.php';

  // 12 Curated Luxury Beauty Products with Soft Champagne, Pearl, Warm Beige & Gold Accents
  private defaultBeautyProducts: Product[] = [
    {
      id: 1,
      name: 'L’Élixir Doré Glow Face Oil',
      description: 'Nourishing facial oil infused with plant-derived squalane, cold-pressed rosehip seed oil, and golden micro-pearls for a radiant, silky complexion.',
      price: 640.00,
      stock: 24,
      category: 'Skincare',
      image_url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1631730486784-5456119f69ae?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
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
      image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviews_count: 104,
      is_featured: true
    }
  ];

  constructor(private platform: Platform) {
    if (this.platform.is('android')) {
      this.apiUrl = 'http://10.0.2.2/backend/api.php';
    } else {
      this.apiUrl = 'http://localhost/backend/api.php';
    }
  }

  public async getProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(this.apiUrl, { timeout: 1800 });
      if (
        response.data &&
        response.data.status === 'success' &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        return response.data.data.map((p: any, index: number) => {
          const fallback = this.defaultBeautyProducts[index % this.defaultBeautyProducts.length];
          return {
            id: Number(p.id),
            name: p.name || fallback.name,
            description: p.description || fallback.description,
            price: Number(p.price) || fallback.price,
            stock: Number(p.stock) || fallback.stock,
            category: p.category || fallback.category,
            image_url: p.image_url || fallback.image_url,
            rating: fallback.rating,
            reviews_count: fallback.reviews_count,
            is_featured: index < 4
          };
        });
      }
    } catch (e) {
      console.warn('Backend unavailable or response empty. Using 12-item luxury collection:', e);
    }
    return this.getFallbackProducts();
  }

  public getFallbackProducts(): Product[] {
    return JSON.parse(JSON.stringify(this.defaultBeautyProducts));
  }
}
