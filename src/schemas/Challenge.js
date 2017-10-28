module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const Challenge = new Schema({
    title : String,
    description : String,
    users : [{ type: Schema.Types.ObjectId, ref : 'User'}], // all users in challege, watchers and invited
    payments : [{ type: Schema.Types.ObjectId, ref : 'Payment'}],
    image_url : String
  });

  // Challenge.pre('save', function(next) {
    
  // });
  // Challenge.post('save', function (next) {
    
  // })

  return mongoose.model('Challenge', Challenge)
};