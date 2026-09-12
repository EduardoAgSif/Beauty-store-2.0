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
      description: 'Aceite facial nutritivo infundido con escualano vegetal, rosa mosqueta y microdestellos dorados para un resplandor sedoso.',
      price: 640.00,
      stock: 24,
      category: 'Skincare',
      image_url: 'https://images.unsplash.com/photo-1608248597359-bb4f59c869fb?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviews_count: 142,
      is_featured: true
    },
    {
      id: 2,
      name: 'Champagne Silk Hydrating Cream',
      description: 'Crema hidratante ultra ligera con extracto de perla blanca, ceramidas y ácido hialurónico que nutre en profundidad.',
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
      description: 'Labial mate aterciopelado en tono cálido con infusión de aceite de jojoba y vitamina E. Acabado confortable por 16 horas.',
      price: 290.00,
      stock: 45,
      category: 'Maquillaje',
      image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviews_count: 112,
      is_featured: true
    },
    {
      id: 4,
      name: 'Subtle Glow Liquid Illuminator',
      description: 'Iluminador fluido tono champán perlado que funde con la piel dejando un acabado luminoso natural y sofisticado.',
      price: 380.00,
      stock: 18,
      category: 'Maquillaje',
      image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      reviews_count: 67,
      is_featured: false
    },
    {
      id: 5,
      name: 'Rose & Amber Gold Eau de Parfum',
      description: 'Aroma cautivador con notas de vainilla dorada, orquídea blanca, rosa de Damasco y un cálido fondo de sándalo y ámbar.',
      price: 980.00,
      stock: 15,
      category: 'Fragancias',
      image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
      rating: 5.0,
      reviews_count: 89,
      is_featured: true
    },
    {
      id: 6,
      name: 'Botanical Gold Repair Hair Serum',
      description: 'Sérum capilar reparador con aceite de argán marroquí y keratina bioactiva que sella puntas y aporta brillo satinado.',
      price: 450.00,
      stock: 20,
      category: 'Cuidado Capilar',
      image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviews_count: 76,
      is_featured: false
    },
    {
      id: 7,
      name: 'Pearl Radiance Gentle Cleanser',
      description: 'Gel limpiador espumoso con polvo de perla natural y té blanco que purifica la tez respetando la barrera cutánea.',
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
      description: 'Colección de 9 sombras en tonos neutros cálidos, topo ahumado y destellos dorados con textura ultra difuminable.',
      price: 560.00,
      stock: 28,
      category: 'Maquillaje',
      image_url: 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      reviews_count: 93,
      is_featured: true
    },
    {
      id: 9,
      name: 'Golden Orchid Luxury Body Mist',
      description: 'Bruma corporal perfumada con néctar de orquídea dorada y jazmín para una sensación fresca y envolvente durante el día.',
      price: 410.00,
      stock: 22,
      category: 'Fragancias',
      image_url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80',
      rating: 4.6,
      reviews_count: 41,
      is_featured: false
    },
    {
      id: 10,
      name: 'Hydra-Plump Lip Treatment Balm',
      description: 'Tratamiento labial reconstituyente enriquecido con péptidos voluminizadores, manteca de mango y cera vegetal.',
      price: 220.00,
      stock: 50,
      category: 'Maquillaje',
      image_url: 'https://images.unsplash.com/photo-1631730486784-5456119f69ae?auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      reviews_count: 82,
      is_featured: false
    },
    {
      id: 11,
      name: 'Nourishing Cashmere Hair Mask',
      description: 'Tratamiento acondicionador profundo formulado con proteínas de cachemira y manteca de murumuru para cabello suave y disciplinado.',
      price: 490.00,
      stock: 16,
      category: 'Cuidado Capilar',
      image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviews_count: 65,
      is_featured: false
    },
    {
      id: 12,
      name: 'Pure Gold Eye Contour Cream',
      description: 'Crema para el contorno de ojos con cafeína pura y péptidos tensores que atenúan ojeras y líneas de expresión.',
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
