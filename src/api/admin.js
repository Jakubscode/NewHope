const crypto = require('crypto');
const path = require('path')
const fs = require('fs')
const { send } = require('./notifs.js')
const secret = 'abcdefg';

const login = (app) => async (user, pass)  => {
	const hash = crypto.createHmac('sha256', pass)
   .update('I love cupcakes')
   .digest('hex');
	const admin = await app.models.Admin.findOne({login : user}).exec()
	return hash == admin.pass 
	? {
		success : true,
		token : admin.token
	}
	: {
		success : false
	}
}
const auth = (app) => async (token) => {
	const admin = await app.models.Admin.findOne({token}).exec()
	console.log(admin)
	return admin != null 
	? {
		_id : admin._id
	}
	: null
}
const addChallenge = (app) => async (title, description, image, users, inviter_id) => { //notify all new challenge
	console.log(title, description, image)
	const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
	const imageUrl = path.join("/uploads/challenges/", `${title}${Date.now()}.jpeg`)
	const imagePath = path.join(__dirname , "../../", imageUrl)
	console.log(users.constructor)
	if (users.constructor == String) {
		users = [users]
	}
	require("fs").writeFile(imagePath, base64Data, 'base64', function(err) {
	  console.log(err);
	});
	const challenge = new app.models.Challenge({
		title,
		description,
		image_url : imageUrl,
		users
	})
	const status = await challenge.save()
	console.log(inviter_id, users)
	await Promise.all(users.map((user_id) => {
			const newCh = new app.models.UserChallenge({
			    user_id: user_id,
			    inviter_id : {
			      kind : 'Admin',
			      user : inviter_id
			    },
			    challenge_id : status._id,
			    done : {
			    	status : false,
			    	image : ""
			    },
			    accepted : false,
			    watchers : [],
			})
			return newCh.save()
	}))
	return status
	// Database request, return saved data
	
}
const getChallenges = (app) => async () => { //all challenges and users in challenges that paid
	return app.models.Challenge.find({})
		.populate('users')
		.populate({
			path  :'payments',
			populate : {
				path : "user_id"
			}
		}) // TODO populate by user
		.exec()
}
const getChallenge = (app) => async (challenge_id) => { //all challenges and users in challenges that paid
	return app.models.Challenge.find({_id : challenge_id})
		.populate('users')
		.populate('payments')
		.exec()
}
const getUser = (app) => async (user_id) => { // all data , messages, payments
	return app.models.User.findOne({_id : user_id})
		.populate('challenges')
		.populate('payments')
		.exec()
}
const getMessages = (app) => async () => {
	return app.models.Message.find({},[], {sort : {date : -1}})
		.populate("challenge_id")
		.populate("user_id")
		.exec()
}
const sendMessage = (app) => async (data) => { //data.challenge_id, data.user_id, data.all, data.image
	console.log(data)
	const base64Data = data.image.replace(/^data:image\/jpeg;base64,/, "");
	const imageUrl = path.join("/uploads/messages/", `${Date.now() + "" + Math.random()}.jpeg`)
	const imagePath = path.join(__dirname , "../../", imageUrl)
	require("fs").writeFile(imagePath, base64Data, 'base64', function(err) {
	  console.log(err);
	});
	const challenge = new app.models.Message({
		topic : data.topic,
		text : data.text,
		image_url : imageUrl,
		challenge_id : data.challenge_id ? data.challenge_id : null,
		user_id : data.user_id ? data.user_id : null,
	})
	challenge.save()
}
const findUser = (app) => async(query) => {
	console.log(query)
	return app.models.User.find({"name" : new RegExp(query, "i")}).exec()
}
module.exports = (app) => ({
	login : login(app),
	auth : auth(app),
	addChallenge : addChallenge(app),
	findUser : findUser(app),
	getChallenges : getChallenges(app),
	getUser : getUser(app),
	getChallenge : getChallenge(app),
	sendMessage : sendMessage(app),
	getMessages : getMessages(app)
})