// server.js — Punto de entrada del servidor GraphQL
// Apollo Server v5 + Express | BeautyStore 2.0
// Apollo Server v5 docs: https://www.apollographql.com/docs/apollo-server

import 'dotenv/config';
import { ApolloServer }                      from '@apollo/server';
import { expressMiddleware }                 from '@as-integrations/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express                               from 'express';
import http                                  from 'http';
import cors                                  from 'cors';
import jwt                                   from 'jsonwebtoken';

import { typeDefs }  from './typeDefs.js';
import { resolvers } from './resolvers.js';

// ──────────────────────────────────────────────────────────────────────────────
// Context: decodifica el JWT del header Authorization
// ──────────────────────────────────────────────────────────────────────────────
async function buildContext({ req }) {
  const authHeader = req.headers.authorization || '';

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'dev_secret_cambia_esto'
      );
      return { user: decoded };
    } catch {
      // Token inválido o expirado — contexto anónimo
    }
  }

  return { user: null };
}

// ──────────────────────────────────────────────────────────────────────────────
// Bootstrap
// ──────────────────────────────────────────────────────────────────────────────
async function startServer() {
  const app        = express();
  const httpServer = http.createServer(app);

  // CORS: permite el cliente Ionic/Angular y el Sandbox de Apollo
  const corsOptions = {
    origin: [
      'http://localhost:8100',  // Ionic dev
      'http://localhost:4200',  // Angular dev
      'http://localhost:4000',  // GraphQL Sandbox
      'https://studio.apollographql.com', // Apollo Studio
      'capacitor://localhost',  // Capacitor native
      'ionic://localhost',
    ],
    credentials: true,
  };

  // ─── Apollo Server v5 ──────────────────────────────────────────────────────
  // En v5, ApolloServer ya NO acepta `formatError` directamente.
  // Se usa un plugin `willSendResponse` para transformar errores.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Plugin: ocultar detalles de error en producción
      {
        async requestDidStart() {
          return {
            async willSendResponse({ response }) {
              if (process.env.NODE_ENV === 'production' && response.body.kind === 'single') {
                const errors = response.body.singleResult.errors;
                if (errors) {
                  response.body.singleResult.errors = errors.map(err => ({
                    message:    err.message,
                    extensions: { code: err.extensions?.code },
                  }));
                }
              }
            },
          };
        },
      },
    ],
  });

  await server.start();

  // Middleware global
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '1mb' })); // Limitar payload

  // ─── Endpoint GraphQL (/graphql) ──────────────────────────────────────────
  app.use(
    '/graphql',
    expressMiddleware(server, { context: buildContext })
  );

  // ─── Health check ─────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({
      status:  'ok',
      node:    process.version,
      service: 'BeautyStore GraphQL API',
      apollo:  '5.x',
      time:    new Date().toISOString(),
    });
  });

  // ─── 404 para rutas desconocidas ──────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada. Usa /graphql' });
  });

  // Iniciar
  const PORT = parseInt(process.env.PORT || '4000', 10);
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));

  console.log(`
🚀  BeautyStore GraphQL API lista
📡  Endpoint : http://localhost:${PORT}/graphql
🏥  Health   : http://localhost:${PORT}/health
🗄️   DB       : ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'app_db'}
🟢  Node.js  : ${process.version}
⚡  Apollo   : Server v5
  `);
}

startServer().catch(err => {
  console.error('❌  Error al iniciar el servidor:', err);
  process.exit(1);
});
