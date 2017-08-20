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
var ProductScheme = {
    title: String,
    description: String,
    attributes: [],
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
    title: String,
     status: {
        type: String,
        enum : ['pending','closed'],
        default: 'pending'
    },
    customer: {
        type: Schema.ObjectId,
        ref: 'Customer',
        required: [true, " Please specify the customer"]
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
