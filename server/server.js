const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const http = require('http');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const port = process.env.PORT || 3000;
const partialsPath = path.join(__dirname,'../views/partials');
const publicPath = path.join(__dirname, '../public');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const mongoose = require('./db/mongoose.js')
var {User} = require('./models/user.js');
var {Conversation} = require('./models/conversation.js');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

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

// app.post('/getContacts',urlencodedParser,(req, res)=>{
//   var search =  req.body.search;
//   console.log(search);
// });

//socketIO


io.on('connection',(socket)=>{
  console.log('New user connected');


  //on loading

  socket.on('getMyContacts', async(data) =>{
    try {
      var user = await User.findByToken(data.token);
      if(!user){
        return Promise.reject();
      }
      socket.emit('myContacts', user.contacts);
    } catch (e) {
      console.log(e);
    }
  });

  //searching
  socket.on('getContacts',async (toSearch)=>{
    try{
      var users = await User.find({
        username: { $regex: new RegExp('^' + toSearch.search), $options: 'i' }
      });
      var nameArr =[];
      users.forEach(function(user){
        nameArr.push(_.pick(user, ['username', '_id']));
      });
      socket.emit('responseResearch', nameArr)
    } catch(e){
      console.log('e', e);
    }
  });

  //Requests

  socket.on('sendRequest', async(data, callback)=>{
    try{
      var user = await User.findByToken(data.token);
      if(!user){
        return Promise.reject();
      }

      var update = {
        $push:{
          requests: {
            requesterId: user._id,
            name: user.username
          }
        }
      }
      user = await User.findOneAndUpdate({_id: data.add}, update, {new : true});
      if(!user){
        console.log('failed');
        throw new Error();
      }
      // console.log(user);
      callback();
    }catch(e){
      console.log('error');
      return callback('Failed to add user');
    }
  });

  socket.on('seeRequest', async (data)=>{
    try{
      var user = await User.findByToken(data.token);
      if(!user){
        return Promise.reject();
      }
      // console.log(user);
      var requestArr = [];
      user.requests.forEach(function(request){
        var requester = _.pick(request, ['requesterId', 'name']);
        requestArr.push(requester);
      });
      socket.emit('responseSeeRequest', requestArr);
    }catch(e){
      console.log(e);
    }
  });

  socket.on('acceptRequest', async(data, callback)=>{
    try{
      var user = await User.findByToken(data.token);
      if(!user){
        return Promise.reject();
      }

      var update = {
        $pull:{
          requests: {
            requesterId: data.add
          }
        },
        $push:{
          contacts: {
            contactId: data.add,
            name: data.name
          }
        }
      }
      user = await User.findOneAndUpdate({_id: user._id}, update, {new : true});
      update = {
        $push:{
          contacts:{
            contactId: user._id,
            name: user.username
          }
        }
      }
      var requester =  await User.findOneAndUpdate({_id : ObjectID(data.add)},update,{new:true})
      if(!(user || requester)){
        console.log('failed');
        throw new Error();
      }
      // console.log(user);
      callback();
    }catch(e){
      console.log(e);
      return callback('Failed to add user');
    }
  });

  socket.on('declineRequest',async(data, callback)=>{
    try{
      var user = await User.findByToken(data.token);
      if(!user){
        return Promise.reject();
      }
      var update = {
        $pull:{
          requests: {
            requesterId: data.decline
          }
        }
      };
      user = await User.findOneAndUpdate({_id: user._id}, update, {new : true});
      if(!user){
        console.log('failed');
        throw new Error();
      }
      console.log(user);
      callback();
    }catch(e){
      console.log(e);
      return callback('Failed to add user');
    }
  });
  socket.on('disconnect',()=>{
    console.log('User offline');
  });
});
server.listen(port,()=>{
  console.log(`Server is up on ${port}`);
});
