const FB = require('fb');
const Promisify = require('../promisify')
const APP_ID = '2020770054860677'
const APP_SECRET = '4630828c4bedc069d86fdc688d603921'
const userImgSize = 100
const mongoose = require('mongoose')

const path = require('path')
const fs = require('fs')

const loginUser = (app) => async (fbID, accessToken, firebaseToken) => {
    let userName;
    FB.setAccessToken(accessToken);
    const User = app.models.User
    const [friends, imgData] = await Promise.all([Promisify(FB.api, `/${fbID}/friends`),Promisify(FB.api, `/${fbID}/picture?redirect=false&type=normal`)])
    const result = await User.findOne({ fbID }).exec()
    userName =  result ? result.name : ''
    if (result === null) {
        const userData = await Promisify(FB.api, `/${fbID}`)
        userName = userData.name
        const addedUser = new User({
            name: userName,
            fbToken: accessToken,
            firebaseToken,
            fbID,
            fbFriends: friends.data.map(friend => friend.id),
            img_url: imgData.data.url,
            challenges: [],
            payments: []
        });
            const fbFriends = friends.data.map(friend => friend.id)
            fbFriends.forEach((fbID) => {
                mongoose.models.User.updateOne({fbID}, {
                    $addToSet : {
                        fbFriends : fbID
                    }
                }).exec()
                .then((s) => {
                    console.log("user updated fbFriends", s)
                })
            })
        await addedUser.save()
    } else {
        await User.update({ fbID }, {$set: {img_url: imgData.data.url, firebaseToken, fbFriends: friends.data.map(friend => friend.id), fbToken: accessToken}}).exec()
    }
        return { imgUrl: imgData.data.url, name: userName }
}


const getUserChallenges = app => async fbID => {
    const User = app.models.User;
    const userData = await User.findOne({ fbID })
        .populate({
            path : 'challenges',
            populate : { path:'challenge_id' }
        }).populate({
        path: 'challenges',
        populate : {path: 'inviter_id.user'}
    })

        .exec()
    console.log(userData);
    const userChallengesData = userData.challenges.map(challenge => ({
            challenge_id: challenge.challenge_id._id,
            _id: challenge._id,
            title: challenge.challenge_id.title,
            accepted: challenge.accepted,
            description: challenge.challenge_id.description,
            imgUrl: challenge.challenge_id.image_url,
            inviter: challenge.inviter_id.user.name || 'ADMIN'
        })
    )

    const acceptedChallenges = userChallengesData.filter(challengeData => challengeData.accepted)
    const notAcceptedChallenges = userChallengesData.filter(challengeData => !challengeData.accepted)
    return {
        acceptedChallenges,
        notAcceptedChallenges
    }
}


const getUserMessages = (app) => async (fbID) => {
    const userData = await app.models.User.findOne({ fbID })
        .populate({
            path : "challenges",
        })
        .exec()
    
    const challenges = await app.models.Challenge.find({
        users: userData._id
    })
    .exec()
    const mappedChallenges = challenges.map((challenge) => (challenge._id))
    //console.log(mappedChallenges)
    const queryData = {
        user_id : userData._id,
        challenges : mappedChallenges
    }
    //console.log(queryData)
    const messages = await app.models.Message.find({
        $or : [{
            challenge_id : {
                $in : queryData.challenges
            }
        },
        {
            user_id : {
                $eq : mongoose.Types.ObjectId(queryData.user_id)
            }
        }]
    }).exec()

    return messages

}


const getChallenge = app => async challengeId => {
    const challenge = await app.models.Challenge.findOne({_id: challengeId}).exec()
    return { challenge }
}

const acceptChallenge = app => async (userId, challengeId) => {
    const result =  await app.models.UserChallenge.updateOne({_id: challengeId}, {$set : {accepted: true}}).exec()
    return true;
}

const commitPayment = (app) => async (data) => {
    console.log(data)
    console.log({fbID : data.fbID})
    const user = await app.models.User.findOne({fbID : data.fbID}).exec()
    console.log(user)
    const _payment = new app.models.Payment({
        user_id : user._id,
        challenge_id : data.challenge_id,
        user_challenge_id : data.user_challenge_id,
        amount : data.amount
    })
    const payment = await _payment.save()
    console.log(payment)
    const updatePayments = app.models.Challenge.updateOne({_id : data.challenge_id}, {$addToSet : {payments : payment._id}}).exec()
    console.log(updatePayments)
    return updatePayments
}
const getUserPayments = (app) => async (fbID) => {
    const user = await app.models.User.findOne({fbID})

    const payments = await app.models.Payment.find({user_id : user.id})
        .populate('challenge_id')
    .lean()
        .exec()
    return payments.map(payment => {
        return {
            ...payment,
            challengeTitle: payment.challenge_id.title
        }
    })
}
const doChallenge = app => async (userChallengeId, image) => {
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const imageUrl = path.join("/uploads/userChallenges/", `${userChallengeId}.jpeg`)
    const imagePath = path.join(__dirname , "../../", imageUrl)
    require("fs").writeFile(imagePath, base64Data, 'base64', function(err) {
      console.log(err);
    });
    const result =  await app.models.UserChallenge.updateOne({_id: userChallengeId}, {
        $set : {
            done: { 
                status : true,
                image : imageUrl
            }
        }
    }).exec()
    return result;
}
module.exports = (app) => ({
    login : loginUser(app),
    getUserMessages : getUserMessages(app),
    getUserChallenges: getUserChallenges(app),
    getChallenge: getChallenge(app),
    acceptChallenge: acceptChallenge(app),
    commitPayment : commitPayment(app),
    getUserPayments : getUserPayments(app),
    doChallenge : doChallenge(app)
})