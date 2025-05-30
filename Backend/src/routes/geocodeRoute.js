const express = require("express");
const axios = require("axios");
const router = express.Router();
const createError = require("../utils/createError");

router.get("/", async (req, res) => {
  let street = null;
  let city = null;
  let code = null;
  let country = "Italy";

  if (req.query.street) {
    if (typeof req.query.street != "string" && req.query.street.length > 34) {
      return res
        .status(400)
        .json(
          createError(
            "Richiesta non valida",
            400,
            "Stai inserendo una via errata,  deve essere una parola e non puó essere piú lunga di 34 caratteri (es. Viale Giovanni Pierluigi da Palestrina)"
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
            "Stai inserendo erratamente la cittá, deve essere una parola e non puó essere piú lunga di 34 caratteri (es. San Valentino in Abruzzo Citeriore)"
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
            "Stai inserendo una codice postale errato,deve essere un numero e non puó essere non piú lunga di 5 caratteri (es. Viale Giovanni Pierluigi da Palestrina)"
          )
        );
    }
    code = req.query.code;
  }

  if (req.query.stNumber) {
    if (
      typeof req.query.stNumber != "integer" &&
      req.query.stNumber.length > 5
    ) {
      return res
        .status(400)
        .json(
          createError(
            "Richiesta non valida",
            400,
            "Stai inserendo un numero di via errato,deve essere un numero e non puó essere piú lunga di 5 caratteri"
          )
        );
    }
    street = street + " " + req.query.stNumber;
  }

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
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
      }
    );
    res.status(200).json(response.data);
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
