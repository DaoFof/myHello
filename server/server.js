const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const partialsPath = path.join(__dirname,'../views/partials');
const publicPath = path.join(__dirname, '../public');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const mongoose = require('./db/mongoose.js')
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate');

var app = express();

hbs.registerPartials(partialsPath);

hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
});

app.set('view engine', 'hbs');
//app.engine('html', hbs.__express);

app.use(express.static(publicPath));

app.get('/',(req, res)=>{
  res.render('index.hbs');
});

app.get('/login',(req, res)=>{
  res.redirect("/home.html");
});

app.get('/home',authenticate,(req, res)=>{
  var token = req.token;
  res.render('home.hbs',{
    user: req.user
  });
});

app.post('/', urlencodedParser, (req, res)=>{
  var type = req.body.post;
  if(type==='signup'){
    var objUser = {
      email: req.body.email,
      password: req.body.password,
      username : req.body.username,
    };
    var user =  new User(objUser);

    user.save().then(()=>{
      return user.generateAuthToken();
    }).then((token)=>{

      res.send({token});
    }).catch((e)=>{
      res.status(400).send(JSON.stringify(e, undefined, 2));
    });
  }else if(type==='signin'){
    var objUser={
      username: req.body.username,
      password: req.body.password
    };
    User.findByCredentials(req.body.username, req.body.password).then((user)=>{
      return user.generateAuthToken().then((token)=>{
        res.send({token});
      });
    }).catch((e)=>{
      res.status(400).send(JSON.stringify(e, undefined, 2));
    });
  }
});

app.get('/logout',authenticate, (req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.redirect('/');
  }).catch((e)=>{
    console.log(e);
  });
});

app.post('/getContacts',urlencodedParser,(req, res)=>{
  var search =  req.body.search;
  console.log(search);
});

app.listen(port,()=>{
  console.log(`Server is up on ${port}`);
});
