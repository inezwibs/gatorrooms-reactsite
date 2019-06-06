const express = require('express');
var models = require('../models');
const axios = require('axios');
const router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { clearListing, convertSequilizeToObject, findUserBySession } = require('../utils/index');

function clearListings(listings) {
  return listings.map((l) => clearListing(l));
}

const getGeocodingInfo = (address, onSuccess, onError) => {
  const apiKey = 'AIzaSyCiI9shqkKiKx8rs57v02JoWtKfP2aSyHk'
  axios
      .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`)
      .then(onSuccess)
      .catch(onError);
}

const deg2rad = (deg) => {
  return (deg * Math.PI / 180.0);
}
const rad2deg = (rad) => {
  return (rad * 180.0 / Math.PI);
}

const distance = (lat1, lon1, lat2, lon2, unit = 'M') => {
  theta = lon1 - lon2;
  dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
  dist = Math.acos(dist);
  dist = rad2deg(dist);
  dist = dist * 60 * 1.1515;
  if (unit == 'K') {
    dist = dist * 1.609344;
  } else if (unit == 'N') {
    dist = dist * 0.8684;
  }
  return dist;
}

/*    
  newest, bedrooms, cheapest
*/
_buildSearchQuery = async (req) => {
  let searchQuery = {};
  let order = [];
  const query = req.query
  
  if (query.type) {
    let types = await models.HousingType.findAll({
      where: {
        type: query.type
      },
      attributes: [
        'id'
      ]
    });
    types = types.map((value) => value.id);
    searchQuery['HousingTypeId'] = types;
  }

  if(query.approved){
    searchQuery['isApproved'] = {
      [Op.eq]: query.approved.toLowerCase() === 'true' ? 1 : 0
    };
  }

  if(query.profile){
    const profile = await findUserBySession(req);
    searchQuery['UserId'] = {
      [Op.eq]: profile.id
    };
  }

  if(query.beds){
    searchQuery['bedrooms'] = {
      [Op.gte]: query.beds
    }
  }

  if(query.text){
    let txt = decodeURI(query.text);
    searchQuery[Op.or] = [
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('city')),
        {
          [Op.like]: `%${txt}%`
        }
      ),
      {
        zipCode: {
          [Op.like]: `%${txt}`
        }
      },
      Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('state')),
        {
          [Op.like]: `%${txt}%`
        }
      )
    ]
  }

  if(query.sortBy){
    if(query.sortBy === 'newest'){
      order.push([ 'datePosted', 'DESC' ])
    }else if(query.sortBy === 'bedrooms'){
      order.push([ 'bedrooms' ])
    }else if(query.sortBy === 'cheapest'){
      order.push([ 'price' ])
    }else if(query.sortBy === 'distance'){
      order.push([ 'distance' ])
    }
  }

  return {
    searchQuery: searchQuery,
    order: order
  };
}

// http://docs.sequelizejs.com/manual/querying.html

//get listings route
router.get('/', async (req,res) => {
  let result = await _buildSearchQuery(req);
  models.ListingPost.findAll({
    include: [models.HousingType,models.ListingImage],
    exclude: [models.Chat],
    where: result.searchQuery,
    order: result.order
  }).then(listings =>{     
    var body = convertSequilizeToObject(listings);       
    res.json(clearListings(body));
  });
});

router.get('/one/:listingId', async (req,res) => {
  models.ListingPost.findOne({
    include: [models.HousingType,models.ListingImage],
    exclude: [models.Chat],
    where: { id: req.params.listingId }
  }).then(listing =>{     
    var body = convertSequilizeToObject(listing);       
    res.json(clearListing(body));
  });
});

router.put('/one/:listingId', async (req, res) => {
  models.ListingPost.findOne({
    where: { id: req.params.listingId }
  }).then(listing => {
    if (!listing.isApproved) {
      let isApproved = req.query.approve === 'true';
      if (isApproved) {
        listing.update({
          isApproved: isApproved
        }).then(() => res.status(204).send());
      } else {
        // delete
        listing.destroy().then(() => res.status(204).send());
      }
    }
  });
});

router.delete('/one/:listingId', async (req, res) => {
  models.ListingPost.findOne({
    where: { id: req.params.listingId }
  }).then(listing => {
    if (listing) {
      listing.destroy().then(() => res.status(204).send());
    }
  });
});

//return all housing types that website provides
router.get('/types', (_, res) => {
  models.HousingType
    .findAll()
    .then((types) => res.json(types));
});

//create new listing
router.post('/new', async (req, res) => {

  const user = await findUserBySession(req);
  if(!user){
    res.status(401).send();
    return;
  }

  models.HousingType
    .findOne({ where: { type: req.body.housingType } })
    .then((housingType) => {
      // Insert Listing
      models.ListingPost.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        ...req.body.address,
        isApproved: false,
        bathrooms: req.body.bathrooms,
        bedrooms: req.body.bedrooms,
        HousingTypeId: housingType.dataValues.id,
        UserId: user.id
      }).then((createdListing) => {
        // Save Images
        const images = req.body.images;
        const imagesToInsert = [];
        for(let i = 0; i < images.length; i++){
          imagesToInsert.push({
            ListingPostId: createdListing.dataValues.id,
            imageFile: new Buffer(images[0], 'base64')
          });
        }
        if(imagesToInsert.length > 0){
          models.ListingImage.bulkCreate(imagesToInsert)
        }
        const listing = req.body;
        const address = `${listing.line1} ${listing.city} ${listing.state} ${listing.zipCode}`;
        getGeocodingInfo(address, (res) => {
          const results = res.data.results;
          console.log('Test', results);
          if(results.length > 0){
            createdListing.update({
              distance: distance(37.722313, -122.478467, results[0].geometry.location.lat, results[0].geometry.location.lng).toFixed(2)
            })
          }
          res.status = 204;
          res.send();
        }, () => {
          res.status = 204;
          res.send();
        })
      });
    })
});

module.exports = router;
