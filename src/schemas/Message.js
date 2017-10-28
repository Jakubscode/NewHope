module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const Message = new Schema({
    text : String,
    topic : String,
    user_id :  { type: Schema.Types.ObjectId, ref: 'User' },
    image_url : String,
    challenge_id : {type: Schema.Types.ObjectId, ref: 'Challenge' },
    date : Date
  });

  Message.pre('save', function(next) {
    this.date = new Date()
    next()
  });
  // Message.post('save', function (next) {
    
  // })


  return mongoose.model('Message', Message)
};