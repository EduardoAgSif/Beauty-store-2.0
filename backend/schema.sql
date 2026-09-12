-- SQL Script for XAMPP MySQL / MariaDB
-- Database name: app_db

CREATE DATABASE IF NOT EXISTS app_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE app_db;

-- Table structure for `users`
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Test User
-- Email: test@gmail.com
-- Password: admin1234
INSERT INTO users (name, email, password) 
VALUES ('Eduardo Aguilar', 'test@gmail.com', '$2y$10$CtIJuwSXWhxazw/ujFFKo.j.s6ve6dUphFl/K1IZcH6PbHGesIMKG')
ON DUPLICATE KEY UPDATE 
    name='Eduardo Aguilar', 
    password='$2y$10$CtIJuwSXWhxazw/ujFFKo.j.s6ve6dUphFl/K1IZcH6PbHGesIMKG';

-- Table structure for `products`
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category VARCHAR(50) DEFAULT 'Skincare',
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed 12 Luxury Beauty Products Collection
INSERT INTO products (id, name, description, price, stock, category, image_url)
VALUES 
(1, 'L’Élixir Doré Glow Face Oil', 'Aceite facial nutritivo infundido con escualano vegetal, rosa mosqueta y microdestellos dorados para un resplandor sedoso.', 640.00, 24, 'Skincare', 'https://images.unsplash.com/photo-1608248597359-bb4f59c869fb?auto=format&fit=crop&w=600&q=80'),
(2, 'Champagne Silk Hydrating Cream', 'Crema hidratante ultra ligera con extracto de perla blanca, ceramidas y ácido hialurónico que nutre en profundidad.', 520.00, 32, 'Skincare', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'),
(3, 'Velvet Nude Matte Lipstick', 'Labial mate aterciopelado en tono cálido con infusión de aceite de jojoba y vitamina E. Acabado confortable por 16 horas.', 290.00, 45, 'Maquillaje', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'),
(4, 'Subtle Glow Liquid Illuminator', 'Iluminador fluido tono champán perlado que funde con la piel dejando un acabado luminoso natural y sofisticado.', 380.00, 18, 'Maquillaje', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'),
(5, 'Rose & Amber Gold Eau de Parfum', 'Aroma cautivador con notas de vainilla dorada, orquídea blanca, rosa de Damasco y un cálido fondo de sándalo y ámbar.', 980.00, 15, 'Fragancias', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80'),
(6, 'Botanical Gold Repair Hair Serum', 'Sérum capilar reparador con aceite de argán marroquí y keratina bioactiva que sella puntas y aporta brillo satinado.', 450.00, 20, 'Cuidado Capilar', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80'),
(7, 'Pearl Radiance Gentle Cleanser', 'Gel limpiador espumoso con polvo de perla natural y té blanco que purifica la tez respetando la barrera cutánea.', 320.00, 35, 'Skincare', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'),
(8, 'Warm Taupe Eyeshadow Palette', 'Colección de 9 sombras en tonos neutros cálidos, topo ahumado y destellos dorados con textura ultra difuminable.', 560.00, 28, 'Maquillaje', 'https://images.unsplash.com/photo-1522337094846-8a818192de1f?auto=format&fit=crop&w=600&q=80'),
(9, 'Golden Orchid Luxury Body Mist', 'Bruma corporal perfumada con néctar de orquídea dorada y jazmín para una sensación fresca y envolvente durante el día.', 410.00, 22, 'Fragancias', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'),
(10, 'Hydra-Plump Lip Treatment Balm', 'Tratamiento labial reconstituyente enriquecido con péptidos voluminizadores, manteca de mango y cera vegetal.', 220.00, 50, 'Maquillaje', 'https://images.unsplash.com/photo-1631730486784-5456119f69ae?auto=format&fit=crop&w=600&q=80'),
(11, 'Nourishing Cashmere Hair Mask', 'Tratamiento acondicionador profundo formulado con proteínas de cachemira y manteca de murumuru para cabello suave y disciplinado.', 490.00, 16, 'Cuidado Capilar', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'),
(12, 'Pure Gold Eye Contour Cream', 'Crema para el contorno de ojos con cafeína pura y péptidos tensores que atenúan ojeras y líneas de expresión.', 590.00, 25, 'Skincare', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE 
    name=VALUES(name), 
    description=VALUES(description), 
    price=VALUES(price), 
    stock=VALUES(stock), 
    category=VALUES(category), 
    image_url=VALUES(image_url);
