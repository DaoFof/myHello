var {User} = require('./../models/user');
const Cookies = require('cookies');


var authenticate = (req, res, next) =>{
  var cookies = new Cookies(req, res);
  var token = cookies.get('token');
  User.findByToken(token).then((user)=>{
    if(!user){
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    res.clearCookie('token');
    next();
  }).catch((e)=>{
    res.redirect('/home.html');
  });
};
module.exports = {authenticate};
