const express = require('express');
var models = require('../models');
const router = express.Router();
const { generateSessionToken,
	findUserBySession, convertSequilizeToObject } = require('../utils/index');

router.post('/login', (req, res) => {
	
	models.User.findOne({
		where: {
			email: req.body.email,
		}
	}).then(async (user) => {

		if (!user && !await user.comparePassword(req.body.password)) {
			res.status(401).json({ token: null, errorMessage: 'failed!' })
		} else {
			let userSessionToken = generateSessionToken()
			user.setDataValue('sessionToken', userSessionToken);

			user.save().then(() => res.status(200)
				.json({ token: userSessionToken, admin: user.isAdmin }));
		}
	});
});


router.post('/register', (req, res) => {
	models.User.findOne({
		where: {
			email: req.body.email,
		}
	}).then((user) => {

		//if email is already being used
		if (user) {
			return res.status(400).json({ result: 'email is already used' })
		}

		models.User.create({
			email: req.body.email,
			password: req.body.password,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			isAdmin: req.body.isAdmin,
			sessionToken: null
		});

		return res.status(200).json({ result: 'success!' });
	});
});

router.get('/profile', async (req, res) => {
	let user = await findUserBySession(req);
	if(user){
		user = convertSequilizeToObject(user);
		delete user['password']
		res.json(user);
	}else{
		res.status(401).send();
	}
})

//update user profile data
router.post('/profile', async (req, res) => {	
    let user = await findUserBySession(req);
	if(user){
		user.update({
		  email:req.body.profileInfo.email,
		  avatarUrl:req.body.profileInfo.avatarUrl,
		  firstName:req.body.profileInfo.firstName,
		  lastName:req.body.profileInfo.lastName,
		}).then(() => {
		 res.status(200).send()
		});
	}else{
		res.status(401).send();
	}
})

router.get('/session/:token/validate', (req, res) => {
	models.User.findOne({
		where: {
			sessionToken: req.params.token
		}
	}).then((user) => {
		res.status(user && user.sessionToken ? 204 : 401).send();
	})
})

router.put('/session/:token/end', (req, res) => {

	models.User.findOne({
		where: {
			sessionToken: req.params.token,
		}
	}).then((user) => {
		if (!user) {
			return res.status(400).json({ error: 'Bad Request' });
		}
		user.setDataValue('sessionToken', null);
		user.save()
			.then(() => res.status(204).send());
	});
});

module.exports = router;
