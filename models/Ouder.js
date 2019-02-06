const mongoose = require('mongoose');
require('./Kind');
let KindSchema = mongoose.model('Kind').schema;

let validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

let OuderSchema = new mongoose.Schema({
    voornaam : { type: String },
    familienaam : { type: String },
    kinderen : { type: [KindSchema], default: [] },
    functie : { type: String, min: 1, max: 1 },
    geslacht : { type: String, min: 1, max: 1 },
    tel1 : { type: String },
    tel2 : { type: String },
    email : { type: String, validate: [validateEmail, "Gelieve een geldig e-mailadres in te vullen."], index: { unique: true } },
    adres : String,
    postcode : { type: Number, min: [1000, "Geen geldige postcode."], max: [9999, "Geen geldige postcode."] },
    stad : { type: String },
    registratiedatum : { type: Date, default: new Date() },
    updateDatum : { type: String, default: new Date() }
});

mongoose.model('Ouder', OuderSchema);