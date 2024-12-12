const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const api = require('./controllers/api');



const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'bill',
    password: '123',
    database : 'face_recognition'
  }
});

// db.select('*')// debug
//   .from('users') 
//   .then(data => {
//     console.log('Database connected successfully:', data);
//   })
//   .catch(err => {
//     console.error('Database connection error:', err);
//   });

const app = express();

app.use(cors());
app.use(express.json()); 


app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/api/image', (req, res) => { api.handleAPI(req, res)});
app.put('/image', (req, res) => { image.handleImage(req, res, db)})


app.listen(3001, ()=> {
  console.log('app is running on port 3001');
})
 
