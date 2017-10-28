const getAllFriendsUsers = app => async (fbID)  => {
    const User = app.models.User;
    const user = await User.findOne({fbID}).exec()
    const fbFriends = await User.find({ fbID: {$in: user.fbFriends } })
        .populate({
            path: 'challenges',
            populate: { path : 'challenge_id'}
        }).exec()
    return { fbFriends }
}



module.exports = (app) => ({
    getAllFriendsUsers: getAllFriendsUsers(app)
})