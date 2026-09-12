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

-- Seed Beauty Products Collection
INSERT INTO products (id, name, description, price, stock, category, image_url)
VALUES 
(1, 'Rose Radiance Glow Serum', 'Sérum facial iluminador enriquecido con extracto de rosas silvestres, ácido hialurónico puro y vitamina E para una piel fresca y luminosa.', 489.00, 24, 'Skincare', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'),
(2, 'Velvet Matte Lipstick Rose Chic', 'Labial mate de larga duración (16 hrs) con infusión de aceite de jojoba y manteca de karité para labios suaves sin sensación de resequedad.', 265.00, 40, 'Maquillaje', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'),
(3, 'Hydra-Boost Floral Facial Mist', 'Bruma hidratante revitalizante con agua de azahar y aloe vera. Fija el maquillaje y refresca la piel en cualquier momento del día.', 299.00, 18, 'Skincare', 'https://images.unsplash.com/photo-1608248597359-bb4f59c869fb?auto=format&fit=crop&w=600&q=80'),
(4, 'L’Élixir Fleur Eau de Parfum', 'Fragancia sofisticada con notas de salida de peonía rosada, jazmín blanco y un fondo sensual de vainilla y ámbar amaderado.', 890.00, 12, 'Fragancias', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80'),
(5, 'Silk Touch Bronzing & Highlight Palette', 'Paleta dúo iluminador y bronceador con micropigmentos perla que aportan una calidez natural y un acabado satinado profesional.', 430.00, 22, 'Maquillaje', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'),
(6, 'Botanical Repair Hair Mask', 'Tratamiento capilar intensivo con aceite de argán marroquí y keratina vegetal que restaura las puntas abiertas y aporta brillo sedoso.', 345.00, 15, 'Cuidado Capilar', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80'),
(7, 'Purifying Gentle Cleansing Foam', 'Espuma limpiadora facial con té verde y centella asiática que elimina impurezas respetando la barrera cutánea sin irritar.', 310.00, 30, 'Skincare', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'),
(8, 'Lash Infinite Volumizing Mascara', 'Máscara para pestañas a prueba de agua con cepillo de cerdas en reloj de arena para un volumen dramático y definición extrema.', 240.00, 35, 'Maquillaje', 'https://images.unsplash.com/photo-1631730486784-5456119f69ae?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE 
    name=VALUES(name), 
    description=VALUES(description), 
    price=VALUES(price), 
    stock=VALUES(stock), 
    category=VALUES(category), 
    image_url=VALUES(image_url);
