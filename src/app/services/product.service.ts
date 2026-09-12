import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import axios from 'axios';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost/backend/api.php';

  // Curated Beauty & Cosmetics Catalog (used as seed and fallback)
  private defaultBeautyProducts: Product[] = [
    {
      id: 1,
      name: 'Rose Radiance Glow Serum',
      description: 'Sérum facial iluminador enriquecido con extracto de rosas silvestres, ácido hialurónico puro y vitamina E para una piel fresca y luminosa.',
      price: 489.00,
      stock: 24,
      category: 'Skincare',
      image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviews_count: 142,
      is_featured: true
    },
    {
      id: 2,
      name: 'Velvet Matte Lipstick Rose Chic',
      description: 'Labial mate de larga duración (16 hrs) con infusión de aceite de jojoba y manteca de karité para labios suaves sin sensación de resequedad.',
      price: 265.00,
      stock: 40,
      category: 'Maquillaje',
      image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      reviews_count: 98,
      is_featured: true
    },
    {
      id: 3,
      name: 'Hydra-Boost Floral Facial Mist',
      description: 'Bruma hidratante revitalizante con agua de azahar y aloe vera. Fija el maquillaje y refresca la piel en cualquier momento del día.',
      price: 299.00,
      stock: 18,
      category: 'Skincare',
      image_url: 'https://images.unsplash.com/photo-1608248597359-bb4f59c869fb?auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      reviews_count: 64,
      is_featured: false
    },
    {
      id: 4,
      name: 'L’Élixir Fleur Eau de Parfum',
      description: 'Fragancia sofisticada con notas de salida de peonía rosada, jazmín blanco y un fondo sensual de vainilla y ámbar amaderado.',
      price: 890.00,
      stock: 12,
      category: 'Fragancias',
      image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
      rating: 5.0,
      reviews_count: 87,
      is_featured: true
    },
    {
      id: 5,
      name: 'Silk Touch Bronzing & Highlight Palette',
      description: 'Paleta dúo iluminador y bronceador con micropigmentos perla que aportan una calidez natural y un acabado satinado profesional.',
      price: 430.00,
      stock: 22,
      category: 'Maquillaje',
      image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      reviews_count: 53,
      is_featured: false
    },
    {
      id: 6,
      name: 'Botanical Repair Hair Mask',
      description: 'Tratamiento capilar intensivo con aceite de argán marroquí y keratina vegetal que restaura las puntas abiertas y aporta brillo sedoso.',
      price: 345.00,
      stock: 15,
      category: 'Cuidado Capilar',
      image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviews_count: 110,
      is_featured: true
    },
    {
      id: 7,
      name: 'Purifying Gentle Cleansing Foam',
      description: 'Espuma limpiadora facial con té verde y centella asiática que elimina impurezas respetando la barrera cutánea sin irritar.',
      price: 310.00,
      stock: 30,
      category: 'Skincare',
      image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      rating: 4.6,
      reviews_count: 75,
      is_featured: false
    },
    {
      id: 8,
      name: 'Lash Infinite Volumizing Mascara',
      description: 'Máscara para pestañas a prueba de agua con cepillo de cerdas en reloj de arena para un volumen dramático y definición extrema.',
      price: 240.00,
      stock: 35,
      category: 'Maquillaje',
      image_url: 'https://images.unsplash.com/photo-1631730486784-5456119f69ae?auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      reviews_count: 89,
      is_featured: false
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
      const response = await axios.get(this.apiUrl, { timeout: 3500 });
      if (response.data && response.data.status === 'success' && Array.isArray(response.data.data) && response.data.data.length > 0) {
        // Formatear o enriquecer productos que vengan de la base de datos
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
            is_featured: index < 3
          };
        });
      }
    } catch (e) {
      console.warn('Backend MySQL unreachable or empty. Serving beauty collection fallback:', e);
    }
    return this.defaultBeautyProducts;
  }

  public getFallbackProducts(): Product[] {
    return [...this.defaultBeautyProducts];
  }
}
