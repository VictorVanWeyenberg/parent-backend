let mongoose = require('mongoose');
let crypto = require("crypto");
let jwt = require("express-jwt");

let UserSchema = new mongoose.Schema({
    email : { type: String, lowercase: true, unique: true },
    hash : String,
    salt : String,
    registrationDate : { type: Date, default: new Date() }
});

UserSchema.methods.setPassword = (password) => {
    this.salt = crypto.randomBytes(32).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
}

UserSchema.methods.validPassword = (password) => {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.hash == hash;
}

UserSchema.methods.generateJWT = () => {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, process.env.PARENT_SECRET);
}

mongoose.model('User', UserSchema);