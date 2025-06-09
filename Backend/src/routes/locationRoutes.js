const express = require("express");
const axios = require("axios");
const router = express.Router();
const createError = require("../utils/createError");

router.get("/", async (req, res) => {
  let street = null;
  let city = null;
  let code = null;
  let country = "Italy";
  let q = null;

  if (req.query.street) {
    if (typeof req.query.street != "string" && req.query.street.length > 34) {
      return res
        .status(400)
        .json(
          createError(
            "Richiesta non valida",
            400,
            "Stai inserendo una via errata,  deve essere una parola e non può essere più lunga di 34 caratteri (es. Viale Giovanni Pierluigi da Palestrina)"
          )
        );
    }
    street = req.query.street;
  }

  if (req.query.city) {
    if (typeof req.query.city != "string" && req.query.city.length > 34) {
      return res
        .status(400)
        .json(
          createError(
            "Richiesta non valida",
            400,
            "Stai inserendo erratamente la città, deve essere una parola e non può essere più lunga di 34 caratteri (es. San Valentino in Abruzzo Citeriore)"
          )
        );
    }
    city = req.query.city;
  }

  if (req.query.code) {
    if (typeof req.query.code != "integer" && req.query.code.length != 5) {
      return res
        .status(400)
        .json(
          createError(
            "Richiesta non valida",
            400,
            "Stai inserendo una codice postale errato, deve essere un numero e non può essere non più lunga di 5 caratteri."
          )
        );
    }
    code = req.query.code;
  }

  if (req.query.stNumber) {
    if (
      typeof req.query.stNumber != "string" &&
      req.query.stNumber.length > 5
    ) {
      return res
        .status(400)
        .json(
          createError(
            "Richiesta non valida",
            400,
            "Stai inserendo un numero di via errato,deve essere un numero e non può essere più lunga di 5 caratteri"
          )
        );
    }
    street = street + " " + req.query.stNumber;
  }

  if (req.query.q) {
    if (typeof req.query.q != "string") {
      return res
        .status(400)
        .json(
          createError(
            "Richiesta non valida",
            400,
            "Non stai inserendo una ricerca corretta, prova a verificare che il contenuto della ricerca esista!"
          )
        );
    }
    q = req.query.q;
  }

  try {
    let response = null;
    console.log("Query:", { street, city, code, country});
    if (street && code && city && !q) {
      response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          street: street,
          city: city,
          postalcode: code,
          country: country,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "PavedWay", // OpenStreetMap lo richiede!
        },
      });
    } else if (q && !street && !code && !city) {
      response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: q,
          format: "json"
        },
        headers: {
          "User-Agent": "PavedWay", // OpenStreetMap lo richiede!
        },
      });
    }
    console.log(response.data);
    const data = response.data.map(item => ({
      name: item.display_name,
      latitude: item.lat,
      longitude: item.lon,
    }));
    console.log(data);

    res.status(200).json(data);
  } catch (error) {
    if (typeof error != "number") {
      return res
        .status(500)
        .json(
          createError(
            "Richiesta non valida",
            500,
            "Errore interno del server Nominatim, aspetta qualche minuto prima di riprovare"
          )
        );
    }
    res.status(error.code).json(error);
  }
});

module.exports = router;
