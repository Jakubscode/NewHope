module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    const User = new Schema({
        name: String,
        fbToken: String,
        fbID: String,
        img_url: String,
        challenges: [{type: Schema.Types.ObjectId, ref: 'UserChallenge'}],
        payments: [{type: Schema.Types.ObjectId, ref: 'Payment'}],
    });

    // User.pre('save', function(next) {

    // });
    // User.post('save', function (next) {

    // })

    return mongoose.model('User', User)
};