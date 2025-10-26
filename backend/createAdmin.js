require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connecté à MongoDB');
    
    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@room.tn' });
    
    if (existingAdmin) {
      console.log('Un administrateur existe déjà avec cet email');
      process.exit(0);
    }
    
    // Créer un nouvel admin
    const admin = new User({
      email: 'admin@room.tn',
      password: 'admin@room.tn', // À changer après la première connexion
      full_name: 'Administrateur',
      role: 'admin'
    });
    
    // Le mot de passe sera automatiquement hashé par le middleware pre-save
    await admin.save();
    
    console.log('Administrateur créé avec succès:');
    console.log('Email: admin@room.tn');
    console.log('Mot de passe: admin@room.tn');
    console.log('\n⚠️ IMPORTANT: Changez ce mot de passe après votre première connexion !');
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    process.exit(1);
  }
};

createAdmin();

