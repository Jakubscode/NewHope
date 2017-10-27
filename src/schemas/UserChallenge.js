module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const UserChallenge = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref : 'User'},
    inviter_id : {
      type : String,
      user : { type: Schema.Types.ObjectId, refPath : 'inviter_id.type'},
    }
    challenge_id : { type: Schema.Types.ObjectId, ref : 'Challenge'},
    done : {

    },
    accepted : Boolean,
    watchers : [{ type: Schema.Types.ObjectId, ref : 'User'}],

  });
  // UserChallenge.pre('save', function(next) {
    
  // });
  // UserChallenge.post('save', function (next) {
    
  // })

  return mongoose.model('UserChallenge', UserChallenge)
};