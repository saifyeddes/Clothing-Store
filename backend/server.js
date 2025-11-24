// Configuration CORS
const corsOptions = {
  origin: [
    'https://roomtn.netlify.app',  // Votre frontend en production
    'http://localhost:5173'        // Pour le développement local
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Appliquez la configuration CORS
app.use(cors(corsOptions));

// Gestion des requêtes OPTIONS (pré-vol)
app.options('*', cors(corsOptions));