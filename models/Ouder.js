const mongoose = require('mongoose');

let validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

let OuderSchema = new mongoose.Schema({
    voornaam : { type: String, required: true },
    familienaam : { type: String, required: true },
    functie : { type: String, required: true, min: 1, max: 1 },
    geslacht : { type: String, required: true, min: 1, max: 1 },
    tel1 : { type: String, required: true },
    tel2 : { type: String, required: true },
    email : { type: String, required: true, validate: [validateEmail, "Gelieve een geldig e-mailadres in te vullen."], index: { unique: true } },
    adres : { type: String, required: true },
    postcode : { type: Number, required: true, min: [1000, "Geen geldige postcode."], max: [9999, "Geen geldige postcode."] },
    stad : { type: String, required: true },
    registratiedatum : { type: Date, default: new Date() },
    updateDatum : { type: String, required: true, default: new Date() }
});

mongoose.model('Ouder', OuderSchema);