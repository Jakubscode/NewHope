const FB = require('fb');
const Promisify = require('../promisify')
const APP_ID = '2020770054860677'
const APP_SECRET = '4630828c4bedc069d86fdc688d603921'
const userImgSize = 100
//



const loginUser = (app) => async (fbID, accessToken) => {
    let userName;
    FB.setAccessToken(accessToken);
    const User = app.models.User
    const imgData = await Promisify(FB.api, `/${fbID}/picture?redirect=false&type=normal`)
    const result = await User.findOne({ fbID }).exec()
    userName =  result ? result.name : ''
    if (result === null) {
        const userData = await Promisify(FB.api, `/${fbID}`)
        userName = userData.name
        const addedUser = new User({
            name: userName,
            fbToken: accessToken,
            fbID,
            img_url: imgData.data.url,
            challenges: [],
            payments: []
        });
        await addedUser.save()
    } else {
        await User.update({fbID}, {$set: {img_url: imgData.data.url, fbToken: accessToken}}).exec()
    }

        return { imgUrl: imgData.data.url, name: userName }
}


const getUserChallanges = app => async fbID => {
    const User = app.models.User;
    const UserChallange = app.models.UserChallange;
    const userData = await User.findOne({ fbID })
        .populate({
            path : 'challenges',
            populate : { path:'challenge_id' }
        }).populate({
        path: 'challanges',
        populate : {path: 'inviter_id'}
    })

        .exec()
    const userChallangesData = userData.challenges.map(challenge => ({
            id: challenge.challenge_id._id,
            title: challenge.challenge_id.title,
            accepted: challenge.accepted,
            description: challenge.challenge_id.description,
            imgUrl: challenge.challenge_id.image_url,
            inviter: challenge.inviter_id.user.name || 'ADMIN'
        })
    )

    const acceptedChallenges = userChallangesData.filter(challengeData => challengeData.accepted)
    const notAcceptedChallenges = userChallangesData.filter(challengeData => !challengeData.accepted)
    return {
        acceptedChallenges,
        notAcceptedChallenges
    }
}


module.exports = (app) => ({
    login : loginUser(app),
    getUserChallanges: getUserChallanges(app)
})