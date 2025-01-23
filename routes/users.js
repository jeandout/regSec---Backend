var express = require('express');
var router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const passport = require('passport');

const SECRET_KEY = process.env.JWT_SECRET_KEY;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

// Route d'inscription (sign-up)
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ result: false, message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createDate = Date.now();

    const newUser = new User({
      email,
      password: hashedPassword,
      token: uuidv4(),
      createdAt: createDate,
    });
    await newUser.save();

    const jwtToken = jwt.sign({ token: newUser.token }, SECRET_KEY, { expiresIn: '15d' });

    res.status(201).json({
      result: true,
      message: 'Inscription réussie',
      token: jwtToken,
    });
  } catch (err) {
    res.status(500).json({ result: false, message: 'Erreur lors de l\'inscription', error: err.message });
  }
});

// Route de connexion (sign-in)
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ result: false, message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ result: false, message: 'Email ou mot de passe incorrect' });
    }

    const jwtToken = jwt.sign({ token: user.token }, SECRET_KEY, { expiresIn: '15d' });

    res.json({
      result: true,
      message: 'Connexion réussie',
      token: jwtToken,
      accounts: user.accounts,
      settings: user.settings,
    });
  } catch (err) {
    res.status(500).json({ result: false, message: 'Erreur lors de la connexion', error: err.message });
  }
});

// Route pour supprimer un compte
router.delete('/delete-account', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {

    const token = req.user.token;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ result:false, message: 'Utilisateur non trouvé' });
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({result:true, message: 'Compte supprimé avec succès' });
  } catch (err) {
    res.status(500).json({result:false, message: 'Erreur lors de la suppression du compte', error: err.message });
  }
});

