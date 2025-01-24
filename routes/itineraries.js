var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');

/* GET itinéraries */
router.get('/waypoints', async (req, res) => {
  const geojsonPath = path.join(__dirname, "../GEOJSON/Points.geojson");

  fs.readFile(geojsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier GeoJSON:', err.message);
      return res.status(500).json({
        result: false,
        message: 'Erreur lors de la lecture du fichier GeoJSON',
        error: err.message,
      });
    }
    const geojsonData = JSON.parse(data);

    // Filtrer les propriétés à renvoyer (par exemple, en supprimant "properties" et en gardant "geometry")
    const filteredFeatures = geojsonData.features.map(feature => {
      return {
        name: feature.properties.name,
        coordinates: feature.geometry.coordinates, // Garder la géométrie
        // Vous pouvez choisir d'inclure uniquement certaines propriétés (par exemple "properties.name")
        properties: {
          sym: feature.properties.sym,
          type: feature.properties.type
        }
      };
    });
    // Envoyer le contenu du fichier comme JSON
    res.status(200).json(filteredFeatures);
  });
});

router.get('/routes', async (req, res) => {
  const geojsonPath = path.join(__dirname, "../GEOJSON/AdultesParcours.geojson");

  fs.readFile(geojsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier GeoJSON:', err.message);
      return res.status(500).json({
        result: false,
        message: 'Erreur lors de la lecture du fichier GeoJSON',
        error: err.message,
      });
    }
    const geojsonData = JSON.parse(data);

    // Filtrer les propriétés à renvoyer (par exemple, en supprimant "properties" et en gardant "geometry")
    const filteredFeatures = geojsonData.features.map(feature => {
      const convertGeoJSONCoordinates = (geoJSONCoordinates) => {
        return geoJSONCoordinates.map(([longitude, latitude]) => ({
          latitude,
          longitude
        }));
      };

      const convertedCoordinates = convertGeoJSONCoordinates(feature.geometry.coordinates);
      return {
        name: feature.properties.name,
        coordinates: convertedCoordinates, // Garder la géométrie
        // Vous pouvez choisir d'inclure uniquement certaines propriétés (par exemple "properties.name")
        properties: {
          name: feature.properties.name,
          description: feature.properties.description
        }
      };
    });
    // Envoyer le contenu du fichier comme JSON
    res.status(200).json(filteredFeatures);
  });
});

router.get('/logistic-routes', async (req, res) => {
  const geojsonPath = path.join(__dirname, "../GEOJSON/LogistiqueParcours.geojson");

  fs.readFile(geojsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier GeoJSON:', err.message);
      return res.status(500).json({
        result: false,
        message: 'Erreur lors de la lecture du fichier GeoJSON',
        error: err.message,
      });
    }
    const geojsonData = JSON.parse(data);

    // Filtrer les propriétés à renvoyer (par exemple, en supprimant "properties" et en gardant "geometry")
    const filteredFeatures = geojsonData.features.map(feature => {
      const convertGeoJSONCoordinates = (geoJSONCoordinates) => {
        return geoJSONCoordinates.map(([longitude, latitude]) => ({
          latitude,
          longitude
        }));
      };

      const convertedCoordinates = convertGeoJSONCoordinates(feature.geometry.coordinates);
      return {
        name: feature.properties.name,
        coordinates: convertedCoordinates, // Garder la géométrie
        // Vous pouvez choisir d'inclure uniquement certaines propriétés (par exemple "properties.name")
        properties: {
          name: feature.properties.name,
          description: feature.properties.description
        }
      };
    });
    // Envoyer le contenu du fichier comme JSON
    res.status(200).json(filteredFeatures);
  });
});


module.exports = router;
