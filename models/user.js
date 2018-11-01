var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
// const _ = require('lodash');
const bcrypt = require('bcryptjs');
//var List = require('./lists');
userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: { 
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    },

  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

});

// toJSON method(default method from mongoose) is a default method that we can use to overwrite what gets sent back. we convert it to object to remove all mono additions using toObject()
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  const { _id, email, tokens} = userObject;
  return { _id, email, token: tokens[0].token };
}

// instance method to add/remove from the database
//we convert the id to hexstring and then the jwt output to string
userSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id.toHexString() }, 'secretspy').toString();
  //jwt.sign helps generates a secret encrypted token
  //push it into user.token then save the user object 
  user.tokens.push({ access, token });
    return user.save().then(() => token);
}

userSchema.methods.removeToken = function (token) {
  const user = this;
  //the below function enables us to remove the token equal to the token in the argument
  return user.update({
    $pull:{
      tokens: {token}
    }
  })
};

//model method
userSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'secretspy');
    // jwt.verify decrypt this encrypted token
  } catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

}

//Model method to get values from the database
userSchema.statics.findByCredentials = function (email, password){
  const User = this;
  return User.findOne({email}).then(user=>{
    if(!user){
      return Promise.reject();
      // promise to reject sends the function back to the catch error 
    }
    // bcrypt relies heavily in Promises. so we need to continue with promises

    return new Promise((resolve, reject)=>{
      bcrypt.compare(password, user.password, (err, result)=>{
        if(result){
          resolve(user);
          //passes the user found as a promise when => then <= is called
        }else{
          reject();
        }
      
      });
    });
  })
  .catch(e=>Promise.reject())
}

// listening to events in mongoose this cann be done using the mongoose middleware. Schema.pre()
userSchema.pre('save', function(next){
  const user = this;
  if(user.isModified('password')){
    //this helps to check if there is a change in a particular field passed in stinged argument
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(user.password, salt, (err, hashed)=>{
        user.password = hashed;
        next();
      });
    });
  }else{
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User }