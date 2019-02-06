let mongoose = require('mongoose');

let KindSchema = new mongoose.Schema({
    voornaam : { type : String, required : true },
    achternaam : { type : String, required : true },
    geslacht : { type : String, required : true, min: 1, max: 1 },
    geboortedatum : { type : Date, required : true },
    alleen_naar_huis : { type : Boolean, required : true },
    medische : { type : String, required : true },
    onPhoto : { type : Boolean, required : true },
    notities : { type : String, required : true },
    actief : { type : Boolean, required : true },
    registratiedatum : { type : Date, default : new Date() },
    updateDatum : { type : Date, default : new Date() }
});

mongoose.model('Kind', KindSchema);