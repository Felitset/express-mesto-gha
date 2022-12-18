const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const user = require('./routes/user.js');
const card = require('./routes/card.js');
const error = require('./routes/wrong-route.js');

const PORT = 3000;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyparser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '639089097eb07f07a8168945'
  };

  next();
});

app.use('/users', user);

app.use('/cards', card);
app.use('*', error);

app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`);
});

