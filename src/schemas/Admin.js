module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const Admin = new Schema({
    //employee:  { type: Schema.Types.ObjectId, ref: 'Employees' },
    login : String,
    pass : String,
    token : String
  });

  Admin.pre('save', function(next) {
    
  });
  Admin.post('save', function (next) {
    
  })

  return mongoose.model('Admin', Admin)
};