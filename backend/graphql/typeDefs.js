// typeDefs.js — Schema GraphQL para BeautyStore 2.0

export const typeDefs = `#graphql

  # ─── Tipos Base ────────────────────────────────────────────────

  type User {
    id:         Int!
    name:       String!
    email:      String!
    created_at: String
  }

  type Product {
    id:          Int!
    name:        String!
    description: String
    price:       Float!
    stock:       Int!
    category:    String
    image_url:   String
    created_at:  String
  }

  type AuthPayload {
    token: String!
    user:  User!
  }

  type DeleteResult {
    success: Boolean!
    message: String!
  }

  type MutationResult {
    success: Boolean!
    message: String!
  }

  # ─── Queries ────────────────────────────────────────────────────

  type Query {
    """Obtiene todos los productos (con filtros opcionales)"""
    products(
      category: String
      search:   String
      minPrice: Float
      maxPrice: Float
      limit:    Int
      offset:   Int
    ): [Product!]!

    """Obtiene un producto por su ID"""
    product(id: Int!): Product

    """Obtiene todos los usuarios (requiere token)"""
    users: [User!]!

    """Obtiene el perfil del usuario autenticado"""
    me: User

    """Categorías únicas disponibles"""
    categories: [String!]!

    """Total de productos (para paginación)"""
    productsCount(category: String, search: String): Int!
  }

  # ─── Mutations ──────────────────────────────────────────────────

  type Mutation {
    """Registro de nuevo usuario"""
    signup(name: String!, email: String!, password: String!): AuthPayload!

    """Login y obtención de JWT"""
    login(email: String!, password: String!): AuthPayload!

    """Crear un nuevo producto (requiere token)"""
    createProduct(
      name:        String!
      description: String
      price:       Float!
      stock:       Int!
      category:    String
      image_url:   String
    ): Product!

    """Actualizar un producto existente (requiere token)"""
    updateProduct(
      id:          Int!
      name:        String
      description: String
      price:       Float
      stock:       Int
      category:    String
      image_url:   String
    ): Product!

    """Eliminar un producto (requiere token)"""
    deleteProduct(id: Int!): DeleteResult!

    """Cambiar contraseña del usuario autenticado"""
    changePassword(currentPassword: String!, newPassword: String!): MutationResult!
  }
`;
