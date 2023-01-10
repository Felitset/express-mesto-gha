const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./routes/wrong-route');

const PORT = 3000;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyparser.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('*', error);

// app.use((err, req, res, next) => {
//   res.status(500).send({ message: 'На сервере произошла ошибка' });
// });

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
