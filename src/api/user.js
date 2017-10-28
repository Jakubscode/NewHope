const FB = require('fb');
const Promisify = require('../promisify')
const APP_ID = '2020770054860677'
const APP_SECRET = '4630828c4bedc069d86fdc688d603921'
const userImgSize = 100
const mongoose = require('mongoose')



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
        await addedUser.save()
    } else {
        await User.update({ fbID }, {$set: {img_url: imgData.data.url, fbFriends: friends.data.map(friend => friend.id), fbToken: accessToken}}).exec()
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
        path: 'challanges',
        populate : {path: 'inviter_id'}
    })

        .exec()
    const userChallengesData = userData.challenges.map(challenge => ({
            id: challenge.challenge_id._id,
            challenge_id: challenge._id,
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


getUserMessages = (app) => async (fbID) => {
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

module.exports = (app) => ({
    login : loginUser(app),
    getUserMessages : getUserMessages(app),
    getUserChallenges: getUserChallenges(app)
})