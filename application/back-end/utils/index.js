const express = require('express');
var models = require('../models');
var app = express();
const _ = require('lodash');

const rand = () => Math.random(0).toString(36).substr(2);
const token = (length) => (rand() + rand() + rand() + rand()).substr(0, length);

const generateSessionToken = () => token(15);

// sequelize returns a json that needs to be cleaned up a bit
clearListing = (listing) => {
    delete listing['HousingTypeId']
    listing['housingType'] = listing['HousingType'] ? listing['HousingType'].type : null;
    delete listing['HousingType'];
    if (listing['ListingImages'] && _.isArray(listing['ListingImages'])) {
        let images = listing['ListingImages']
            .map((value) => value.imageFile);
        delete listing['ListingImages'];
        listing['images'] = images;
    }
    else {
        delete listing['ListingImages'];
        listing['images'] = [];
    }
    listing['datePosted'] = (new Date(listing['datePosted'])).toLocaleString('en-us', { month: 'long', day: 'numeric' });
    return listing;
}

convertSequilizeToObject = (sequelizeResp) => {
    var replacer = app.get('json replacer');
    var spaces = app.get('json spaces');
    var body = JSON.stringify(sequelizeResp, replacer, spaces);
    return JSON.parse(body);
}

const findUserBySession = async (req) => {
    const sessionToken = req.headers.session;
    return models.User.findOne({
        where: {
			sessionToken: sessionToken
		}
    })
}

module.exports = {
    findUserBySession, convertSequilizeToObject, clearListing, generateSessionToken
}
