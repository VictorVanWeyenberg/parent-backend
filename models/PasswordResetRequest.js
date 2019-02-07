let mongoose = require('mongoose');

let PasswordResetRequestSchema = new mongoose.Schema({
    email : { type : String, required : true },
    code : { type : String },
    salt : { type : String },
    requestDate : { type : Date, default : new Date() }
});

PasswordResetRequestSchema.methods.setCode = function(code) {
    this.salt = crypto.randomBytes(32).toString('hex');
    this.code = crypto.pbkdf2Sync(code, this.salt, 10000, 64, 'sha512').toString('hex');
}

PasswordResetRequestSchema.methods.validCode = function(code) {
    let hash = crypto.pbkdf2Sync(code, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.code == hash;
}

mongoose.model('PasswordResetRequest', PasswordResetRequestSchema);