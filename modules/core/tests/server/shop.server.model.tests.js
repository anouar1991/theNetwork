'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  Category = mongoose.model('Shop');

/**
 * Unit tests
 */
describe('Shop Model', function() {

  describe('Saving', function() {
    it('saves new record');

    it('throws validation error when name is empty');

    it('throws validation error when name longer than 15 chars');
    
    it('throws validation error for duplicate Shop name');
  });

});