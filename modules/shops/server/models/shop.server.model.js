'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Shop Schema
 */
var ShopSchema = new Schema({
    verified: Boolean,
    name: {
        type: String,
        default: '',
        required: 'Please fill Shop name',
        trim: true
    },
    url: {
        type: String,
        default:''
    },
    phoneNumber: {
        type: String,
        required: 'please fill Shop phone number'
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip_code: String
    },
    email: {
        type: String,
        unique: true,
        required: 'Please fill Shop email',
        trim: true
    },
    verificationToken: {
        type: String,
        default: '',
    },
    demandToken: {
        type: String,
        default: '',
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Shop', ShopSchema);
