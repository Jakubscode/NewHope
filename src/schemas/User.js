module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    const User = new Schema({
        name: String,
        fbToken: String,
        fbID: String,
        firebaseToken: [String],
        fbFriends: [String],
        img_url: String,
        challenges: [{type: Schema.Types.ObjectId, ref: 'UserChallenge'}],
        payments: [{type: Schema.Types.ObjectId, ref: 'Payment'}],
    });

    // User.pre('save', function(next) {

    // });
    User.post('save', function (data) {
      console.log(data.fbFriends)
      data.fbFriends.forEach((fbID) => {
        mongoose.models.User.updateOne({fbID}, {
          $addToSet : {
            fbFriends : fbID
          }
        }).exec()
        .then((s) => {
          console.log("user updated fbFriends", s)
        })
      })
    })
    User.post('update', function (data) {
      console.log(data.fbFriends)
      data.fbFriends.forEach((fbID) => {
        mongoose.models.User.updateOne({fbID}, {
          $addToSet : {
            fbFriends : fbID
          }
        }).exec()
        .then((s) => {
          console.log("user updated fbFriends", s)
        })
      })
    })

    return mongoose.model('User', User)
};