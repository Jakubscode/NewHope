const FB = require('fb');
const APP_ID = '2020770054860677'
const APP_SECRET = '4630828c4bedc069d86fdc688d603921'



const loginUser = (app) => async (fbID, accessToken) => {
    FB.setAccessToken(accessToken);
    const User = app.models.User
    const result = await User.findOne({ fbID }).exec()
    if (result === null) {
        FB.api(`/${fbID}`, res => {
            const addedUser = new User({
                name: res.name,
                fbToken: accessToken,
                fbID,
                challenges: [],
                payments: []
            })
            return addedUser.save()
        })
    } else {
       return User.update({ fbID }, { $set: { fbToken: accessToken }}).exec()
    }
}


module.exports = (app) => ({
    login : loginUser(app)
})