// resolvers.js — Lógica de negocio GraphQL para BeautyStore 2.0

import bcrypt      from 'bcryptjs';
import jwt         from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import pool        from './db.js';

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/** Lanza un error 401 si no hay usuario autenticado en el contexto */
function requireAuth(context) {
  if (!context.user) {
    throw new GraphQLError('No autenticado. Proporciona un token JWT válido.', {
      extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
    });
  }
}

/** Firma un JWT con el ID y email del usuario */
function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'dev_secret_cambia_esto',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Resolvers
// ──────────────────────────────────────────────────────────────────────────────

export const resolvers = {
  // ─── QUERIES ──────────────────────────────────────────────────────────────

  Query: {
    // Listar productos con filtros y paginación
    products: async (_parent, { category, search, minPrice, maxPrice, limit = 50, offset = 0 }) => {
      let sql = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category)  { sql += ' AND category = ?';            params.push(category); }
      if (search)    { sql += ' AND name LIKE ?';             params.push(`%${search}%`); }
      if (minPrice != null) { sql += ' AND price >= ?';       params.push(minPrice); }
      if (maxPrice != null) { sql += ' AND price <= ?';       params.push(maxPrice); }

      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await pool.query(sql, params);
      return rows;
    },

    // Obtener un producto por ID
    product: async (_parent, { id }) => {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows[0] || null;
    },

    // Listar todos los usuarios (protegido)
    users: async (_parent, _args, context) => {
      requireAuth(context);
      const [rows] = await pool.query('SELECT id, name, email, created_at FROM users');
      return rows;
    },

    // Perfil del usuario autenticado
    me: async (_parent, _args, context) => {
      requireAuth(context);
      const [rows] = await pool.query(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [context.user.id]
      );
      return rows[0] || null;
    },

    // Categorías únicas
    categories: async () => {
      const [rows] = await pool.query(
        'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
      );
      return rows.map(r => r.category);
    },

    // Conteo para paginación
    productsCount: async (_parent, { category, search }) => {
      let sql = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
      const params = [];

      if (category) { sql += ' AND category = ?';  params.push(category); }
      if (search)   { sql += ' AND name LIKE ?';   params.push(`%${search}%`); }

      const [rows] = await pool.query(sql, params);
      return rows[0].total;
    },
  },

  // ─── MUTATIONS ────────────────────────────────────────────────────────────

  Mutation: {
    // Registro
    signup: async (_parent, { name, email, password }) => {
      // Verificar email duplicado
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        throw new GraphQLError('El correo ya está registrado.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Hash seguro (12 rounds)
      const hashedPassword = await bcrypt.hash(password, 12);

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      const newUser = { id: result.insertId, name, email };
      return { token: signToken(newUser), user: newUser };
    },

    // Login
    login: async (_parent, { email, password }) => {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = rows[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new GraphQLError('Credenciales inválidas.', {
          extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
        });
      }

      return { token: signToken(user), user };
    },

    // Crear producto
    createProduct: async (_parent, args, context) => {
      requireAuth(context);
      const { name, description, price, stock, category, image_url } = args;

      const [result] = await pool.query(
        'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description || null, price, stock, category || 'Skincare', image_url || null]
      );

      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
      return rows[0];
    },

    // Actualizar producto
    updateProduct: async (_parent, { id, ...fields }, context) => {
      requireAuth(context);

      // Construir SET dinámico solo con campos proporcionados
      const allowed = ['name', 'description', 'price', 'stock', 'category', 'image_url'];
      const updates = [];
      const values  = [];

      for (const key of allowed) {
        if (fields[key] !== undefined) {
          updates.push(`${key} = ?`);
          values.push(fields[key]);
        }
      }

      if (updates.length === 0) {
        throw new GraphQLError('Proporciona al menos un campo para actualizar.', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      values.push(id);
      await pool.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);

      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      if (!rows[0]) throw new GraphQLError('Producto no encontrado.', { extensions: { code: 'NOT_FOUND' } });
      return rows[0];
    },

    // Eliminar producto
    deleteProduct: async (_parent, { id }, context) => {
      requireAuth(context);
      const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return { success: false, message: `No se encontró el producto con ID ${id}.` };
      }
      return { success: true, message: `Producto ${id} eliminado correctamente.` };
    },

    // Cambiar contraseña
    changePassword: async (_parent, { currentPassword, newPassword }, context) => {
      requireAuth(context);

      const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [context.user.id]);
      const user = rows[0];

      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        throw new GraphQLError('La contraseña actual es incorrecta.', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const hashed = await bcrypt.hash(newPassword, 12);
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, context.user.id]);

      return { success: true, message: 'Contraseña actualizada correctamente.' };
    },
  },
};
