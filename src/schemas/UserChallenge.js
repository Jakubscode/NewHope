module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const UserChallenge = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref : 'User'},
    inviter_id : {
      kind : String,
      user : { type: Schema.Types.ObjectId, refPath : 'inviter_id.kind'},
    },
    challenge_id : { type: Schema.Types.ObjectId, ref : 'Challenge'},
    done : {

    },
    accepted : Boolean,
    watchers : [{ type: Schema.Types.ObjectId, ref : 'User'}],

  });
  // UserChallenge.pre('save', function(next) {
    
  // });
  UserChallenge.post('save', function (doc) {
      console.log('post UserChallenge save', doc)
      const result = mongoose.models.User.updateOne({_id : doc.user_id}, { $push: { challenges: doc._id} }).exec()
      result.then((res) => {
        console.log("user updateOne")
      })
  })

  return mongoose.model('UserChallenge', UserChallenge)
};