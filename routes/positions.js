var express = require('express');
var router = express.Router();
const Position = require('../models/positions');
const passport = require('passport');

/* GET home page. */
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const positions = await Position.find(); // Récupère tous les documents
        res.status(200).json(positions);
    } catch (err) {
        res.status(500).json({ result: false, message: 'Erreur lors de la récupération des positions', error: err.message });
    }
});

router.get('/latest', async (req, res) => {
    try {
        const latestLocations = await Position.aggregate([
            { $unwind: "$locations" },
            { $sort: { "locations.lastUpdated": -1 } },
            {
              $group: {
                _id: "$role",
                latestLocation: { $first: "$locations" },
              },
            },
          ]);
      
          res.status(200).json(latestLocations);
    } catch (err) {
      res.status(500).json({
        result: false,
        message: 'Erreur lors de la récupération des dernières positions',
        error: err.message,
      });
    }
  });


// Route pour mettre à jour la position de l'utilisateur
router.post('/update-location', async (req, res) => {
    try {
        const { location, user } = req.body

        const position = await Position.findOne({ role: user.role });

        if (position) {
            // Ajoutez la nouvelle position au tableau `locations`
            await Position.updateOne(
                { role: user.role },
                { $push: { locations: location } }
            );
        } else {
            // Créez un nouveau document si aucun document avec le rôle n'existe
            const newPosition = new Position({
                role: user.role,
                locations: [location],
            });
            await newPosition.save();

        }

        res.status(200).json({ result: true, message: 'Position mise à jour avec succès' });
    } catch (err) {
        res.status(500).json({ result: false, message: 'Echec de la mise à jour de la position', error: err.message });
    }
});

module.exports = router;