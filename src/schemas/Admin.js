module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const Admin = new Schema({
    login : String,
    pass : String,
    token : String
  });

  // Admin.pre('save', function(next) {
    
  // });
  // Admin.post('save', function (next) {
    
  // })

  return mongoose.model('Admin', Admin)
};