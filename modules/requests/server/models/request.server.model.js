'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    idValidator = require('mongoose-id-validator'),
    Schema = mongoose.Schema;

/**
 * Request Schema
 */

var OfferSchema = {
    status: {
        type: String,
        enum: ['pending', 'accepted', 'confirmed'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: 'Please Enter Offer Price'
    },
    date: {
        type: Number,
        default: 0
    },
    shopToken: {
        type: String,
        default: ''
    }
};
var ProductScheme = {
    title: String,
    description: String,
    attributes: [],
    offers: [OfferSchema],
    tags: [String],
    created: { type: Date, default: Date.now }
};
var RequestSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    customer: {
        type: Schema.ObjectId,
        ref: 'Customer',
        required: [true, " Please specify the customer"]
    },
    shops: [{
        type: Schema.ObjectId,
        ref: 'Shop'
    }],
    title: String,
    status: {
        type: String,
        enum: ['pending', 'closed'],
        default: 'pending'
    },
    products: [ProductScheme]

});

// validators
//customer validation : 
RequestSchema.path('customer').validate(function(val, res) {
    var Customer = mongoose.model('Customer');
    Customer.findOne({ _id: val }, function(err, customer) {
        if (customer) {
            res(true);
        } else {
            res(false);
        }
    });
}, "the customer doesn't exist");
//scheme plugins : 
RequestSchema.plugin(idValidator);

mongoose.model('Request', RequestSchema);
