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
    const result = await User.findOne({ fbID }).exec()
    userName =  result ? result.name : ''
    if (result === null) {
        const userData = await Promisify(FB.api, `/${fbID}`)
        userName = userData.name
        var addedUser = new User({
            name: userName,
            fbToken: accessToken,
            fbID,
            challenges: [],
            payments: []
        });
        await addedUser.save()
    } else {
        await User.update({ fbID }, { $set: { fbToken: accessToken }}).exec()
    }

        const imgData = await Promisify(FB.api,`/${fbID}/picture?redirect=false&type=normal`)
        return { imgUrl: imgData.data.url, name: userName }
}


module.exports = (app) => ({
    login : loginUser(app)
})