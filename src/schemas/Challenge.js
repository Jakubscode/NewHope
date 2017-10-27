module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const Challenge = new Schema({
    title : String,
    description : String,
    users : [{ type: Schema.Types.ObjectId, ref : 'User'}],
    payments : [{ type: Schema.Types.ObjectId, ref : 'Payment'}],
  });

  // Challenge.pre('save', function(next) {
    
  // });
  // Challenge.post('save', function (next) {
    
  // })

  return mongoose.model('Challenge', Challenge)
};