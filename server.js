const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');
const cors = require('cors');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');
const app = express();
app.use(cors());
//const {ObjectID} = require('mongodb');
app.use(bodyParser.json());

// public todo route
app.post('/todos', authenticate, (req, res) => {
  // we save the user id  in each todo he creates
  const bonny = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  });

  bonny.save().then(val => res.status(201).send(val), e => res.status(400).send(e));

});

//public todo route
// app.post('/todos', (req, res) => {
//   const bonny = new Todo({
//     text: req.body.hello
//   });

//   bonny.save().then(val => res.status(201).send(val), e => res.status(400).send(e));

// });

//get all todos from a particular user
app.get('/todos', authenticate, (req, res)=>{
  Todo.find({_creator: req.user._id}).then(found=>res.status(201).send(found))
  .catch(err =>res.status(401).send(err))
})

// get a particular todo
app.get('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  // if(!ObjectID.isValid(id)){
  //   return res.status(404).send();
  // }
  Todo.findOne({_id: id, _creator: req.user._id }).then(todo => {
    if (!todo) {
      return res.status(404).send();
    } else {
      res.status(200).send(JSON.stringify(todo, undefined, 2));
    }
  }).catch(e => res.status(400).send(e))

});
//5b95c02a88b8291c288f9c4d
// to deletein mongoose
//Todo.remove({}) => this removes all objects in the database
//Todo.findOneAndRemove() takes a query object like {__id: "8658thufui5u7iu54htjniu489
//Todo.findByIdAndremove() takes and if string eg 945hiu4y7thygt95876

app.delete('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  // if(!ObjectID.isValid(id)){
  //   return res.status(404).send();
  // }
  Todo.findOneAndRemove({_id: id, _creator: req.user._id }).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send();

  }).catch(e => res.status(400).send(e))

})

app.patch('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  // if(!ObjectID.isValid(id)){
  //   return res.status(404).send();
  // }
  let { text, completed, completedAt } = req.body;
  if (typeof (completed) === "boolean" && completed) {
    completedAt = new Date().getTime();
  } else {
    completed = false;
    completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id }, { $set: { text, completed, completedAt } }, { new: true }).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(201).send({ todo });

  }).catch(e => res.status(400).send())

});

//SIGN UP call POST /users
app.post('/users', (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save().then(() => user.generateAuthToken())
    .then(token => res.header('x-authe', token).send(user))
    .catch(e => res.status(400).send(e))
});

//SIGN in users POST call
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  User.findByCredentials(email, password)
  .then(foundUser => foundUser.generateAuthToken()
  .then(token=>res.header('x-authe', token).send(foundUser)))
  .catch(e => res.status(403).send()); 
});

//{"email":"francotech7@gmail.com", "password": "123456"}

//a private route to sign out.
app.delete('/users/me/token', authenticate, (req, res)=>{
  req.user.removeToken(req.token).then(
    user=>res.status(200).send()
  ).catch(e=>res.status(400).send())

});
//creating a private route and accessing the token 

app.get('/users/me', authenticate, (req, res) => res.status(201).send(req.user)
);


app.listen(5000, () => console.log('app started'));

// var server = app.listen(3000, function () {
//   var host = server.address().address;
//   var port = server.address().port;
  
//   console.log('node server is here,listening port http://%s:%s', host, port);
// });