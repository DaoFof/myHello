const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate :{
      validator : (value)=>{
        return validator.isEmail(value);
      },
      message : '{VALUE} is not a valid email'
    }
  },
  password :{
    type: String,
    required: true,
    minlength: 8
  },
  username:{
    type: String,
    require: true,
    unique: true,
    minlength: 4
  },
  tokens :[{
    access : {
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }],
  createdAt:{
    type: Date,
    require: true,
    default: Date.now
  }
});

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'JWT_SECRET').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(()=>{
    return token;
  })
};

UserSchema.methods.removeToken = function(token){
  var user = this;

  return user.update({
    $pull:{
      tokens:{token}
    }
  });
};


UserSchema.statics.findByToken = function (token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'JWT_SECRET');
  }catch(e){
    return Promise.reject();
  }

  return User.findOne({
    '_id' : decoded._id,
    'tokens.token': token,//this is a way to query a value in an object, because we use dot(.)
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function(username,password){
  var User = this;

  return User.findOne({username}).then((user)=>{
    if(!user){
      return Promise.reject();
    }
    return new Promise((resolve, reject) =>{
      bcrypt.compare(password, user.password,(err, res)=>{
        if(res){
          resolve(user);
        }else{
          reject();
        }
      });
    });
  });
};


UserSchema.pre('save', function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err, salt)=>{
      bcrypt.hash(user.password, salt,(err, hash)=>{
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
});

var User = mongoose.model('User',UserSchema);

module.exports = {User};
