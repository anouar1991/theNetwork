'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Address Schema
 */
var AddressSchema = new Schema({
    street: String,
    city: String,
    state: String,
    zip_code: String,
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Adress', AddressSchema);
